'use client';
import React, { useState, useEffect } from 'react';
import { signIn, useSession } from "next-auth/react";
import getNextIds from "./helpers/getNextIds";
import getMessages from './helpers/getMessages';
import DataTable from './dataTable';
import MetricTable from './metricTable';
import { Grid } from '@tremor/react';
import { MessageTracker } from './tracker';
import { SetupCard } from './setupCard';
import { fileSizePretty } from './helpers/utils';

export default function Purger() {
  const [maxLoad, setMaxLoad] = useState(1000);
  const { data: session, status } = useSession();

  const [unloadedIds, setUnloadedIds] = useState<string[]>(() => []);
  const [nextToken, setNextToken] = useState<string>("");
  const [okToLoadIds, setOkToLoadIds] = useState(false);

  useEffect(() => {
    const count = unloadedIds.length + messageList.length;
    if(okToLoadIds && !okToLoadMessages && count >= maxLoad) {
      setOkToLoadMessages(true);
    } else if(okToLoadIds && count < maxLoad) {
      //@ts-ignore
      getNextIds(session?.accessToken, nextToken, setNextToken, unloadedIds, setUnloadedIds);
    }
  }, [nextToken, maxLoad, okToLoadIds]);


  // Message content retrieval and indexing
  const [okToLoadMessages, setOkToLoadMessages] = useState(false);
  const [messageList, setMessageList] = useState<any[]>([]);
  const [chunkSize, setChunkSize] = useState<number>(50);

  useEffect(() => {
    if(unloadedIds.length === 0) {
      setOkToLoadMessages(false);
      setOkToLoadIds(false);
      return;
    }
    if(okToLoadMessages) {
      getMessages(
        //@ts-ignore
        session?.accessToken,
        unloadedIds,
        setUnloadedIds,
        messageList,
        setMessageList,
        chunkSize,
        setChunkSize,
      );
    }
  }, [unloadedIds, okToLoadMessages]); 

  // Process messages
  const topEmails = messageList.reduce((topList, nextMessage) => {
    topList.push(nextMessage);
    topList.sort((a:any, b:any) => {return b.size - a.size;});
    return topList.slice(0,10);
  }, []);
  
  return <div>
    {status === "authenticated" && <>
      <Grid numItemsSm={1} numItemsLg={2} className="gap-6">
        <SetupCard start={()=>{setOkToLoadIds(true);}} stop={()=>{setOkToLoadMessages(false); setOkToLoadIds(false); console.log(messageList);}} target={maxLoad} changeTarget={(val)=>{setMaxLoad(val.target.value);}} running={okToLoadIds}/>
        <MessageTracker messageList={messageList} unloadedIds={unloadedIds} maxLoad={maxLoad}/>
        <MetricTable 
          data={messageList} 
          metric="size"
          metricName="Size"
          grouper="from"
          grouperName = "From"
          title ="Largest Senders"
          valueFormatter ={fileSizePretty}
        />
        <MetricTable 
          data={messageList} 
          metric="count"
          metricName="Number"
          grouper="from"
          grouperName = "From"
          title ="Frequent Senders"
          valueFormatter ={(val) => val}
        />
        <MetricTable 
          data={messageList} 
          metric="count"
          metricName="Number"
          grouper="to"
          grouperName = "To"
          title ="Receiving Aliases"
          valueFormatter ={(val) => val}
        />
        <DataTable 
          columns={["sizePretty", "date", "from", "subject"]} 
          columnNames={["Size", "Date", "From", "Subject"]} 
          data={topEmails} 
        />
      </Grid>
    </>}
    {status !== "authenticated" && <button onClick={() => signIn('google')}>Click to sign in</button>}

  </div>;
}
