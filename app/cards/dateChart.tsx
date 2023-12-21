import { InformationCircleIcon } from "@heroicons/react/24/solid";
import { Card, BarChart, Title, Flex, Icon } from "@tremor/react";

export const DateChart = ({messageList, yAggregator, title, tooltip}: {messageList: any[], yAggregator: (msg: any) => number, title:string, tooltip:string}) => {
  var chartData: { [x: string] : number } = {};

  var getDateString = (dateObj:Date) => { return `${dateObj.getMonth()+1}/${dateObj.getDate()}/${dateObj.getFullYear()}`;};
  if(messageList.length > 1 && Date.parse(messageList[0]["date"]) - Date.parse(messageList[messageList.length - 1]["date"]) > 30000000000) {
    getDateString = (dateObj:Date) => { return `${dateObj.getMonth()+1}-${dateObj.getFullYear()}`;};
  }

  for(var i = messageList.length-1; i>=0; i--) {
    const dateObj = new Date(messageList[i]["date"]);
    const dateString = getDateString(dateObj);
    if(!chartData[dateString]) {
      chartData[dateString] = 0;
    }

    chartData[dateString] += yAggregator(messageList[i]);
  }

  var formattedChartData = [];
  for (const [key, value] of Object.entries(chartData)) {
    formattedChartData.push({
      Date: key,
      Size: value,
    })
  }
  
  return <>
    <Card className="mx-auto mb-6">
      <Flex justifyContent="start" className="space-x-2">
        <Title>{title}</Title>
        <Icon icon={InformationCircleIcon} color="stone" tooltip={tooltip} />
      </Flex>
      <Flex className="m-auto h-full">
        <BarChart
          className="mt-6"
          data={formattedChartData}
          index="Date"
          categories={['Size']}
          colors={["neutral"]}
          showLegend={false}
        />
      </Flex>
    </Card>
  </>
};