import { Card, Title, Tracker, Flex, Text, Color, Button, NumberInput, Grid  } from "@tremor/react";

export const SetupCard = ({start, stop, target, changeTarget}: {start:()=>void, stop:()=>void, target:number, changeTarget:(val:any)=>void}) => {
  return <>
    <Card className="mx-auto mb-6">
      <Title>Import Settings</Title>
      <Grid numItemsSm={2} numItemsLg={2} className="gap-6">
        <Text className="my-auto">Number of Emails To Download</Text>
        <NumberInput enableStepper={false} placeholder="" defaultValue={target} onChange={changeTarget}/>
        <Button onClick={start}>Start</Button>
        <Button onClick={stop}>Stop</Button>
      </Grid>
    </Card>
  </>
};