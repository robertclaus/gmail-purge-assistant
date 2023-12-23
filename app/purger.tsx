'use client';
import React, { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import getNextIds from './helpers/getNextIds';
import getMessages from './helpers/getMessages';
import MessageTable from './cards/messageTable';
import MetricTable from './cards/metricTable';
import { Button, Card, Flex, Grid } from '@tremor/react';
import { MessageTracker } from './cards/tracker';
import { SetupCard } from './cards/setupCard';
import { fileSizePretty } from './helpers/utils';
import FAQ from './faq/faq';
import { DateChart } from './cards/dateChart';
import { DateSearch } from './cards/dateSearch';
import { Divider } from "@tremor/react";
import deleteMessage from './helpers/deleteMessage';

export default function Purger() {
  const [maxLoad, setMaxLoad] = useState(1000);
  const [maxEmails, setMaxEmails] = useState(10);
  const { data: session, status } = useSession();
  //@ts-ignore
  const accessToken = session?.accessToken;

  const [unloadedIds, setUnloadedIds] = useState<string[]>(() => []);
  const [nextToken, setNextToken] = useState<string>('');
  const [okToLoadIds, setOkToLoadIds] = useState(false);

  useEffect(() => {
    const count = unloadedIds.length + messageList.length;
    if (okToLoadIds && !okToLoadMessages && count >= maxLoad) {
      setOkToLoadMessages(true);
    } else if (okToLoadIds && count < maxLoad) {
      getNextIds(
        accessToken,
        nextToken,
        setNextToken,
        unloadedIds,
        setUnloadedIds
      );
    }
  }, [nextToken, maxLoad, okToLoadIds]);

  // Message content retrieval and indexing
  const [okToLoadMessages, setOkToLoadMessages] = useState(false);
  const [messageList, setMessageList] = useState<any[]>([]);
  const [hiddenMessageList, setHiddenMessageList] = useState<any[]>([]);
  const [chunkSize, setChunkSize] = useState<number>(50);

  useEffect(() => {
    if (unloadedIds.length === 0) {
      setOkToLoadMessages(false);
      setOkToLoadIds(false);
      return;
    }
    if (okToLoadMessages) {
      getMessages(
        accessToken,
        unloadedIds,
        setUnloadedIds,
        messageList,
        setMessageList,
        chunkSize,
        setChunkSize
      );
    }
  }, [unloadedIds, okToLoadMessages]);

  // Process messages
  const topEmails = messageList.reduce((topList, nextMessage) => {
    topList.push(nextMessage);
    topList.sort((a: any, b: any) => {
      return b.size - a.size;
    });
    return topList.slice(0, maxEmails);
  }, []);

  const deleteFn = (id:string) => {
    deleteMessage(accessToken, id);
  }

  const hideIdFn = (id:string) => {
    if(id) {
      const msg = messageList.find((m)=>{return m["id"] === id;});
      setHiddenMessageList([...hiddenMessageList, msg]);
      setMessageList(messageList.filter((m)=>{return m["id"] !== id;}));
    }
  }

  const hideSenderFn = (sender:string) => {
    if(sender) {
      const msg = messageList.find((m)=>{return m["from"] === sender;});
      setHiddenMessageList([...hiddenMessageList, msg]);
      setMessageList(messageList.filter((m)=>{return m["from"] !== sender;}));
    }
  }

  return (
    <>
      {status === 'authenticated' && (
        <>
          <Card className="mt-6">
            <Grid numItemsSm={1} numItemsLg={2} className="gap-6">
              <SetupCard
                start={() => {
                  setOkToLoadIds(true);
                }}
                stop={() => {
                  setOkToLoadMessages(false);
                  setOkToLoadIds(false);
                }}
                target={maxLoad}
                changeTarget={(val) => {
                  setMaxLoad(val.target.value);
                }}
                maxEmails={maxEmails}
                setMaxEmails={setMaxEmails}
                running={okToLoadIds}
              />
              <MessageTracker
                messageList={messageList}
                unloadedIds={unloadedIds}
                maxLoad={maxLoad}
                rateLimited={chunkSize < 25}
              />
            </Grid>
              <Divider>Date Analysis</Divider>
            <Grid numItemsSm={1} numItemsLg={2} className="gap-6">
              <DateChart
                messageList={messageList}
                yAggregator={(msg) => msg['size'] / 1000000}
                title="Total Email Size (MB)"
                tooltip="This chart shows how much total space was used by emails each unit of time."
              />
              <DateChart
                messageList={messageList}
                yAggregator={(msg) => 1}
                title="Number of Emails"
                tooltip="This chart shows how many emails were received each unit of time."
              />
            </Grid>
            <Flex className="gap-6">
              <DateSearch
                messageList={messageList}
                title="Search By Date Range"
                tooltip="Use this to identify specific emails to delete."
                deleteFn={deleteFn}
                hideFn={hideIdFn}
                maxEmails={maxEmails}
              />
            </Flex>

            <Divider>High Impact Factors</Divider>
            <Grid numItemsSm={1} numItemsLg={2} className="gap-6 mt-12">
              <MetricTable
                data={messageList}
                metric="size"
                metricName="Size"
                grouper="from"
                grouperName="From"
                title="Largest Senders"
                tooltip="Shows the total size of emails associated with each email address that has sent mail in your account. May include emails you have sent as well."
                valueFormatter={fileSizePretty}
                hideFn={hideSenderFn}
              />
              <MetricTable
                data={messageList}
                metric="count"
                metricName="Number"
                grouper="from"
                grouperName="From"
                title="Frequent Senders"
                tooltip="Shows the number of emails associated with each email address that has sent mail in your account. May include emails you have sent as well."
                valueFormatter={(val) => val}
                hideFn={hideSenderFn}
              />
              <MetricTable
                data={messageList}
                metric="count"
                metricName="Number"
                grouper="to"
                grouperName="To"
                title="Receiving Aliases"
                tooltip="Shows the total number of emails associated with each receiving email address in your account. This can be useful if you use email aliases for different types of services."
                valueFormatter={(val) => val}
                hideFn={undefined}
              />
              <MessageTable
                columns={['sizePretty', 'date', 'from', 'subject']}
                columnNames={['Size', 'Date', 'From', 'Subject']}
                data={topEmails}
                title="Largest Emails"
                tooltip="This table shows the largest emails sampled. Click 'Show More' to see columns with additional information."
                deleteFn={deleteFn}
                hideFn={hideIdFn}
              />
            </Grid>
          </Card>
        </>
      )}
      {status !== 'authenticated' && (
        <>
          <Card className="mt-6">
            <div className="text-center pb-4">To start analyzing your emails, log into your email provider:</div>
            <div className="flex justify-center">
              <button onClick={() => signIn('google')} className="gsi-material-button" style={{width:"200px"}}>
                <div className="gsi-material-button-state"></div>
                <div className="gsi-material-button-content-wrapper">
                  <div className="gsi-material-button-icon">
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{display: "block"}}>
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                      <path fill="none" d="M0 0h48v48H0z"></path>
                    </svg>
                  </div>
                  <span className="gsi-material-button-contents">Sign in with Google</span>
                  <span style={{display: "none"}}>Sign in with Google</span>
                </div>
              </button>
            </div>
          </Card>
          <FAQ />
        </>
      )}
    </>
  );
}
