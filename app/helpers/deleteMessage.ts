import { signOut } from "next-auth/react";

function deleteMessage(
    accessToken: string,
    id: string,
) {
  const listUrl = `https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}/trash`;

  fetch(
      listUrl, 
      { 
      method: 'post', 
      headers: new Headers({
          'Authorization': 'Bearer '+accessToken, 
      })
      },
  ).then(resp=>{
      if(resp.status === 401) {
          alert("Your login has timed out. Please log in again.");
          signOut();
          return [];
      }
      if(resp.status === 403) {
          alert("An error occured, please log in again.");
          signOut();
          return [];
      }
      return resp.json();
  }).then((body) => {
      alert("Moved email to trash.");
  }).catch((error) => {
      alert("Encountered an error. Please try again.");
      console.log(error);
  });
  }

export default deleteMessage;