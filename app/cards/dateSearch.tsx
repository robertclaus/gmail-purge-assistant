import { InformationCircleIcon } from '@heroicons/react/24/solid';
import { Card, Title, Flex, Icon, DateRangePicker, DateRangePickerValue } from '@tremor/react';
import DataTable from './dataTable';
import { useEffect, useState } from 'react';

export const DateSearch = ({
  messageList,
  title,
  tooltip
}: {
  messageList: any[];
  title: string;
  tooltip: string;
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
      console.log(filteredMessages);
      filteredMessages = filteredMessages.reduce((topList, nextMessage) => {
        topList.push(nextMessage);
        topList.sort((a: any, b: any) => {
          return b.size - a.size;
        });
        return topList.slice(0, 10);
      }, []);
      setSelectedEmails(filteredMessages);
    }
  }, [dates]);

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
        {selectedEmails.length > 0 && <DataTable
          columns={['sizePretty', 'date', 'from', 'subject']}
          columnNames={['Size', 'Date', 'From', 'Subject']}
          data={selectedEmails}
          title="Selected Emails"
          tooltip="This table shows the emails in the search criteria. Click 'Show More' to see columns with additional information."
        />}
      </Card>
    </>
  );
};
