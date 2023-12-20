import { signOut } from "next-auth/react";
import { fileSizePretty } from "./helpers";

const MAX_CHUNK_SIZE = 75;

function getMessages(
    accessToken: string,
    unloadedIds: string[],
    setUnloadedIds: (arg0: string[]) => void,
    messageList: any[],
    setMessageList: (arg0: any[]) => void,
    chunkSize: number,
    setChunkSize: (arg0: number) => void,
) {
    const getPromise = (idx:string) => {
      //@ts-ignore
      const messageUrl = `https://gmail.googleapis.com/gmail/v1/users/me/messages/${idx}`;

      return fetch(
        messageUrl, 
        { 
          method: 'get', 
          headers: new Headers({
              //@ts-ignore
              'Authorization': 'Bearer '+accessToken, 
          })
        },
      ).catch((error) => {
        alert("An error occured while retrieving a message.");
        console.log(error);
      }).then((resp) => {
        if(resp?.status === 401) {
          alert("Your login has timed out. Please log in again.");
          signOut();
          return undefined;
        }
        if(!resp || !resp.ok){
          return undefined;
        }
        return resp?.json();
      });
    };

    //@ts-ignore
    const chunkOfIds = unloadedIds.slice(0, chunkSize);
    let promises = chunkOfIds.map(getPromise);
    //@ts-ignore
    Promise.all(promises).then((messages) => {
      //@ts-ignore
      var newMessages = messages.filter((body) => {return body !== undefined;});
      
      const successRate = newMessages.length / chunkSize;
      if(successRate < 0.5) {
        //wait to send next message
      }
      if(successRate < 0.95) {
        setChunkSize(Math.max(Math.ceil(chunkSize*0.9 - 1), 1));
      }
      if(successRate > 0.99 && chunkSize < MAX_CHUNK_SIZE) {
        setChunkSize(Math.ceil(Math.max(1, chunkSize*1.1)));
      }

      newMessages = newMessages.map((body) => {
        return {
          id: body.id,
          size: body.sizeEstimate,
          sizePretty: fileSizePretty(body.sizeEstimate),
          //@ts-ignore
          subject: body.payload?.headers.find((obj) => {return obj.name === "Subject"})?.value,
          //@ts-ignore
          from: body.payload?.headers.find((obj) => {return obj.name === "From"})?.value,
          //@ts-ignore
          date: body.payload?.headers.find((obj) => {return obj.name === "Date"})?.value,
        }
      });
      //@ts-ignore
      setMessageList([...messageList, ...newMessages]);
      const retrievedIds = newMessages.map((m) => m.id);
      setUnloadedIds(unloadedIds.filter(item => !retrievedIds.includes(item)));
    });
  }

export default getMessages;