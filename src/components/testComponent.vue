<template>
    <form ref="form" @submit.prevent="sendEmail">
      <label>Name</label>
      <input type="text" name="user_name">
      <label>Email</label>
      <input type="email" name="user_email">
      <label>Message</label>
      <textarea name="message"></textarea>
      <input type="submit" value="Send">
    </form>
</template>
  
<script>
  import emailjs from '@emailjs/browser';
  
  export default {
    methods: {
      sendEmail() {
        var templateParams = {
    from_name: 'James',
    notes: 'Check this out!',
    to_email: 'andraderoberto2497@gmail.com'
};
 
emailjs.send('service_awx3zpc', 'template_6p2xyg9', templateParams,'lC8pzp47_wVba2jIG')
    .then(function(response) {
       console.log('SUCCESS!', response.status, response.text);
    }, function(error) {
       console.log('FAILED...', error);
    });
        }
    }
    }
</script>