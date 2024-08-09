import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import React, { useEffect } from 'react'

const Checkout = () => {
     loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);
     useEffect(() => {
        // Check to see if this is a redirect back from Checkout
        const query = new URLSearchParams(window.location.search);
        if (query.get('success')) {
          console.log('Order placed! You will receive an email confirmation.');
        }
    
        if (query.get('canceled')) {
          console.log('Order canceled -- continue to shop around and checkout when you’re ready.');
        }
      }, []);
  return (
    <div>Checkout</div>
  )
}

export default Checkout