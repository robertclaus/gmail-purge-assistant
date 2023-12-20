import { Card, Title, Tracker, Flex, Text, Color } from "@tremor/react";

interface Tracker {
  color: Color;
  tooltip: string;
}

export const MessageTracker = ({messageList, unloadedIds, maxLoad}: {messageList: any[], unloadedIds:string[], maxLoad:number}) => {
  
  const cellCount = 50;
  const messageLookup = messageList.reduce((messageById, currentMessage) => { messageById[currentMessage["id"]] = currentMessage; return messageById}, {});
  const data: Tracker [] = [];

  var batchMax = Math.ceil(maxLoad / cellCount);
  var loadedCells = Math.ceil(messageList.length/batchMax);
  var unloadedCount = Math.floor(unloadedIds.length/batchMax);

  for(var i=0; i<loadedCells; i++) {
    data.push({ color: "emerald", tooltip: `Fully Loaded` });
  }

  for(var i=0; i<unloadedCount; i++) {
    data.push({ color: "slate", tooltip: `Fully Loaded` });
  }

  for(var i=0; i<(cellCount - unloadedCount - loadedCells); i++) {
    data.push({ color: "stone", tooltip: `Fully Loaded` });
  }
  
  return <>
    <Card className="mx-auto mb-6">
      <Title>Loading Status</Title>
      <Text>Downloading Messages From Gmail</Text>
      <Flex justifyContent="end" className="mt-4">
        <Text>{unloadedIds.length} Messages Expected</Text>
      </Flex>
      <Tracker key={data.length} data={data} className="mt-2" />
    </Card>
  </>
};