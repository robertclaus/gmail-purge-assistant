import { InformationCircleIcon } from '@heroicons/react/24/solid';
import { Card, Title, Tracker, Flex, Text, Color, Icon } from '@tremor/react';

interface Tracker {
  color: Color;
  tooltip: string;
}

export const MessageTracker = ({
  messageList,
  unloadedIds,
  maxLoad,
  rateLimited
}: {
  messageList: any[];
  unloadedIds: string[];
  maxLoad: number;
  rateLimited: boolean;
}) => {
  const cellCount = 50;
  const data: Tracker[] = [];

  var batchMax = Math.ceil(maxLoad / cellCount);
  var loadedCells = Math.ceil(messageList.length / batchMax);
  var unloadedCount = Math.floor(unloadedIds.length / batchMax);

  for (var i = 0; i < loadedCells; i++) {
    data.push({ color: 'emerald', tooltip: `Fully Loaded` });
  }

  for (var i = 0; i < unloadedCount; i++) {
    data.push({ color: 'slate', tooltip: `Fully Loaded` });
  }

  for (var i = 0; i < cellCount - unloadedCount - loadedCells; i++) {
    data.push({ color: 'stone', tooltip: `Fully Loaded` });
  }

  return (
    <>
      <Card className="mx-auto mb-6">
        <Flex justifyContent="start" className="space-x-2">
          <Title>Loading Status</Title>
          {rateLimited && (
            <Icon
              icon={InformationCircleIcon}
              color="red"
              tooltip="Gmail's rate limiting is affecting the load speed. Loading may stop and start as we attempt to load more messages."
            />
          )}
        </Flex>
        <Text>Downloading Messages</Text>
        <Flex justifyContent="between" className="mt-4">
          <Text className="text-xs">{messageList.length} Messages Loaded</Text>
          <Text className="text-xs">
            {unloadedIds.length} Messages Remaining
          </Text>
        </Flex>
        <Tracker key={data.length} data={data} className="mt-2" />
      </Card>
    </>
  );
};
