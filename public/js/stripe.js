/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';


export const bookTour = async (tourId) => {

    const stripe = Stripe(
      'pk_test_51NxACySDsxIySLBtIlLTb8mIApUFAIOkjODHtchatKZla3JImTNK8ntAxJW48CyXDrqbtB1L4uY1VEDzwdHjcJwS00ILn1emi2'
    );
    
  try {
    // 1) Get checkout session from API
    const session = await axios(
      `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`
    );
    console.log(session);

    // 2) Create checkout form + chanre credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
