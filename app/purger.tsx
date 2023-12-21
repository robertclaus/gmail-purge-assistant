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
    return topList.slice(0, 10);
  }, []);

  const deleteFn = (id:string) => {
    deleteMessage(accessToken, id);
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
                  console.log(messageList);
                }}
                target={maxLoad}
                changeTarget={(val) => {
                  setMaxLoad(val.target.value);
                }}
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
                title="Search By Date"
                tooltip="Use this to identify specific emails to delete."
                deleteFn={deleteFn}
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
              />
              <MessageTable
                columns={['sizePretty', 'date', 'from', 'subject']}
                columnNames={['Size', 'Date', 'From', 'Subject']}
                data={topEmails}
                title="Largest Emails"
                tooltip="This table shows the largest emails sampled. Click 'Show More' to see columns with additional information."
                deleteFn={deleteFn}
              />
            </Grid>
          </Card>
        </>
      )}
      {status !== 'authenticated' && (
        <>
          <Card className="mt-6">
            <div className="flex justify-center">
              <Button size="xl" onClick={() => signIn('google')}>
                Click to Sign Into Google!
              </Button>
            </div>
          </Card>
          <FAQ />
        </>
      )}
    </>
  );
}
