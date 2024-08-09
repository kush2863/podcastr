import { GeneratePodcastProps } from '@/types'
import React, { useRef, useState } from 'react'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { Loader } from 'lucide-react'
import { useAction, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { v4 as uuidv4 } from 'uuid';
import { useToast } from "@/components/ui/use-toast"
import { Input } from './ui/input'
import { useUploadFiles } from '@xixixao/uploadstuff/react';
import { cn } from '@/lib/utils'

const useGeneratePodcast = ({
  setAudio, voiceType, voicePrompt, setAudioStorageId
}: GeneratePodcastProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const { startUpload } = useUploadFiles(generateUploadUrl);
  const getPodcastAudio = useAction(api.openai.generateAudioAction);
  const getAudioUrl = useMutation(api.podcasts.getUrl);

  const generatePodcast = async () => {
    setIsGenerating(true);
    setAudio('');

    if(!voicePrompt) {
      toast({
        title: "Please provide a voiceType to generate a podcast",
      });
      return setIsGenerating(false);
    }

    try {
      const response = await getPodcastAudio({
        voice: voiceType,
        input: voicePrompt
      });

      const blob = new Blob([response], { type: 'audio/mpeg' });
      const fileName = `podcast-${uuidv4()}.mp3`;
      const file = new File([blob], fileName, { type: 'audio/mpeg' });

      const uploaded = await startUpload([file]);
      const storageId = (uploaded[0].response as any).storageId;

      setAudioStorageId(storageId);

      const audioUrl = await getAudioUrl({ storageId });
      setAudio(audioUrl!);
      setIsGenerating(false);
      toast({
        title: "Podcast generated successfully",
      });
    } catch (error) {
      console.log('Error generating podcast', error);
      toast({
        title: "Error creating a podcast",
        variant: 'destructive',
      });
      setIsGenerating(false);
    }
  };

  return { isGenerating, generatePodcast };
};

const GeneratePodcast = (props: GeneratePodcastProps) => {
  const { isGenerating, generatePodcast } = useGeneratePodcast(props);
  const [isPodcastGenerate, setIsPodcastGenerate] = useState(true);
  const audioRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const { startUpload } = useUploadFiles(generateUploadUrl);
  const getAudioUrl = useMutation(api.podcasts.getUrl);
  const [isAudioUploading, setIsAudioUploading] = useState(false);

  const uploadAudio = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setIsAudioUploading(true);

    try {
      const files = e.target.files;
      if (!files) return;
      const file = files[0];
      const blob = await file.arrayBuffer().then((ab) => new Blob([ab]));

      const uploaded = await startUpload([new File([blob], file.name, { type: file.type })]);
      const storageId = (uploaded[0].response as any).storageId;

      props.setAudioStorageId(storageId);

      const audioUrl = await getAudioUrl({ storageId });
      props.setAudio(audioUrl!);
      setIsAudioUploading(false);
      toast({
        title: "Audio uploaded successfully",
      });
    } catch (error) {
      console.log('Error uploading audio', error);
      toast({
        title: "Error uploading audio",
        variant: 'destructive',
      });
      setIsAudioUploading(false);
    }
  };

  return (
    <div>
      <div className='generate_thumbnail'>
        <Button
          type="button"
          variant="plain"
          onClick={() => setIsPodcastGenerate(true)} 
          className={cn('', {
            'bg-black-6': isPodcastGenerate
          })}
        >
          Use AI to generate Audio
        </Button>
        <Button
          type="button"
          variant="plain"
          onClick={() => setIsPodcastGenerate(false)} 
          className={cn('', {
            'bg-black-6': !isPodcastGenerate
          })}
        >
          Upload custom Audio
        </Button>
      </div>

      {isPodcastGenerate ? (
        <div className="flex flex-col gap-2.5">
          <Textarea 
            className="input-class font-light focus-visible:ring-offset-orange-1 mt-5"
            placeholder='Provide text to generate audio'
            rows={5}
            value={props.voicePrompt}
            onChange={(e) => props.setVoicePrompt(e.target.value)}
          />
          <div className="mt-5 w-full max-w-[200px]">
            <Button type="submit" className="text-16 bg-orange-1 py-4 font-bold text-white-1" onClick={generatePodcast}>
              {isGenerating ? (
                <>
                  Generating
                  <Loader size={20} className="animate-spin ml-2" />
                </>
              ) : (
                'Generate'
              )}
            </Button>
          </div>
        </div>
      ) : (
        <div className="audio_div mt-5 image_div" onClick={() => audioRef?.current?.click()}>
          <Input 
            type="file"
            className="hidden"
            ref={audioRef}
            accept="audio/*" // Accept any audio format
            onChange={(e) => uploadAudio(e)}
          />
          {!isAudioUploading ? (
            <div className="text-center">
              <p className="text-16 font-medium text-white-1">
                Click to upload audio
              </p>
              <p className="text-12 font-normal text-gray-1">MP3, WAV, etc. (max. 100MB)</p>
            </div>
          ) : (
            <div className="text-16 flex-center font-medium text-white-1">
              Uploading
              <Loader size={20} className="animate-spin ml-2" />
            </div>
          )}
        </div>
      )}

      {props.audio && (
        <audio 
          controls
          src={props.audio}
          autoPlay
          className="mt-5"
          onLoadedMetadata={(e) => props.setAudioDuration(e.currentTarget.duration)}
        />
      )}
    </div>
  );
};

export default GeneratePodcast;
