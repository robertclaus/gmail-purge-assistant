import { Card, Title, Text, Button, NumberInput, Grid  } from "@tremor/react";

export const SetupCard = ({
  start, 
  stop, 
  target, 
  changeTarget,
  running,
}: {
  start: ()=>void, 
  stop: ()=>void, 
  target: number, 
  changeTarget: (val:any)=>void,
  running: boolean
}) => {
  return <>
    <Card className="mx-auto mb-6">
      <Title>Import Settings</Title>
      <Grid numItemsSm={2} numItemsLg={2} className="gap-6">
        <Text className="my-auto">Number of Emails To Download</Text>
        <NumberInput enableStepper={false} placeholder="" defaultValue={target} onChange={changeTarget} disabled={running}/>
        <Button onClick={start} disabled={running}>Start</Button>
        <Button onClick={stop} disabled={!running}>Stop</Button>
      </Grid>
    </Card>
  </>
};