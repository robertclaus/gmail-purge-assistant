import { signOut } from "next-auth/react";




function getNextIds(
    accessToken: string,
    nextToken: string, 
    setNextToken: (arg0: string) => void, 
    unloadedIds: string[][],
    setUnloadedIds: (arg0: string[][]) => void,
) {
    const nextTokenString = nextToken ? `&pageToken=${nextToken}` : "";
    const listUrl = `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=500${nextTokenString}`;

    fetch(
        listUrl, 
        { 
        method: 'get', 
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
        for (let i = 0; i < body.messages.length; i+= 1) {
            const msg = body.messages[i];
            unloadedIds.push(msg["id"]);
        }
        setNextToken(body.nextPageToken);
        setUnloadedIds([...unloadedIds]);
    }).catch((error) => {
        alert("Encountered an error. Please try again.");
        console.log(error);
    });
}

export default getNextIds;