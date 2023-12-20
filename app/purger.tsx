'use client';
import React, { useState, useEffect } from 'react';
import { signIn, useSession } from "next-auth/react";
import getNextIds from "./helpers/getNextIds";
import getMessages from './helpers/getMessages';
import DataTable from './dataTable';
import MetricTable from './metricTable';
import { Button, Card, Grid } from '@tremor/react';
import { MessageTracker } from './tracker';
import { SetupCard } from './setupCard';
import { fileSizePretty } from './helpers/utils';
import FAQ from './faq/faq';

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
  
  return <>
    {status === "authenticated" && <>
    <Card className="mt-6">
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
          tooltip="Shows the total size of emails associated with each email address that has sent mail in your account. May include emails you have sent as well."
          valueFormatter ={fileSizePretty}
        />
        <MetricTable 
          data={messageList} 
          metric="count"
          metricName="Number"
          grouper="from"
          grouperName = "From"
          title ="Frequent Senders"
          tooltip="Shows the number of emails associated with each email address that has sent mail in your account. May include emails you have sent as well."
          valueFormatter ={(val) => val}
        />
        <MetricTable 
          data={messageList} 
          metric="count"
          metricName="Number"
          grouper="to"
          grouperName = "To"
          title ="Receiving Aliases"
          tooltip="Shows the total number of emails associated with each receiving email address in your account. This can be useful if you use email aliases for different types of services."
          valueFormatter ={(val) => val}
        />
        <DataTable 
          columns={["sizePretty", "date", "from", "subject"]} 
          columnNames={["Size", "Date", "From", "Subject"]} 
          data={topEmails} 
          title="Largest Emails"
          tooltip="This table shows the largest emails sampled. Click 'Show More' to see columns with additional information."
        />
      </Grid>
    </Card>
    </>}
    {status !== "authenticated" && <>
      <Card className="mt-6">
        <div className='flex justify-center'>
          <Button size="xl" onClick={() => signIn('google')}>Click to Sign Into Google!</Button>
        </div>
      </Card>
      <FAQ/>
    </>}
  </>;
}
