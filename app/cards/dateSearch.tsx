import { InformationCircleIcon } from '@heroicons/react/24/solid';
import { Card, Title, Flex, Icon, DateRangePicker, DateRangePickerValue } from '@tremor/react';
import MessageTable from './messageTable';
import { useEffect, useState } from 'react';

export const DateSearch = ({
  messageList,
  title,
  tooltip,
  deleteFn,
  hideFn,
  maxEmails,
}: {
  messageList: any[];
  title: string;
  tooltip: string;
  deleteFn: undefined | ((arg0:string) => void);
  hideFn: undefined | ((id:string) => void);
  maxEmails: number;
}) => {
  const [selectedEmails, setSelectedEmails] = useState<any[]>([]);

  const [dates, setDates] = useState<DateRangePickerValue>({
    from: undefined,
    to: undefined,
  });

  useEffect(() => {
    if(dates.from !== undefined && dates.to !== undefined) {
      const from = dates.from?.valueOf();
      const to = dates.to?.valueOf();
      var filteredMessages = messageList.filter((msg) => {
        const msgDate = Date.parse(msg["date"]);
        //@ts-ignore 
        return msgDate > from && msgDate < to;
      });
      filteredMessages = filteredMessages.reduce((topList, nextMessage) => {
        topList.push(nextMessage);
        topList.sort((a: any, b: any) => {
          return b.size - a.size;
        });
        return topList.slice(0, maxEmails);
      }, []);
      setSelectedEmails(filteredMessages);
    }
  }, [dates, messageList]);

  return (
    <>
      <Card className="mx-auto mb-6">
        <Flex justifyContent="start" className="space-x-2">
          <Title>{title}</Title>
          <Icon icon={InformationCircleIcon} color="stone" tooltip={tooltip} />
        </Flex>
        <Flex className='my-6'>
          <DateRangePicker
            className="max-w-sm mx-auto"
            enableSelect={false}
            value={dates}
            onValueChange={setDates}
          />
        </Flex>
        {selectedEmails.length > 0 && <MessageTable
          columns={['sizePretty', 'date', 'from', 'subject']}
          columnNames={['Size', 'Date', 'From', 'Subject']}
          data={selectedEmails}
          title="Selected Emails"
          tooltip="This table shows the emails in the search criteria. Click 'Show More' to see columns with additional information."
          deleteFn={deleteFn}
          hideFn={hideFn}
        />}
      </Card>
    </>
  );
};
