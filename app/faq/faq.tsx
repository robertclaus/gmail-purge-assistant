import { Card, Title, Text } from "@tremor/react";


export default function FAQ() {
    return <div className="my-6">
        <Title>Frequently Asked Questions</Title>
        <Card className="my-4">
            <Title>What am I giving you access to do?</Title>
            <Text>Technically when you log in via Google you are providing our website a temporary access code to read your emails from Gmail. This access code is stored on our server as part of the authentication process. However, our server never actually uses this access code to access your emails. Instead, we provide it back to your browser and all email access is done within your browser on your local device.</Text>
        </Card>
        <Card className="my-4">
            <Title>Do you read my emails?</Title>
            <Text>No. Your emails are only read into your web browser and never reach our server.</Text>
        </Card>
        <Card className="my-4">
            <Title>If I leave my browser open, will that page contain all my emails in the background?</Title>
            <Text>Yes and no. After an email is loaded, the application effectively only keeps the data about the emails that we end up displaying. The application reads your emails a few at a time and saves certain details like the email address, subject, and date. These details are very small and can be stored in the browser. After indexing this information it immediately deletes any unused details such as the email body or attachments.</Text>
        </Card>
        <Card className="my-4">
            <Title>If close my browser will it delete my data?</Title>
            <Text>Yes. At the moment closing the browser page will clear all data that . Note, the access token Google provides us may remain active if you don't sign out.</Text>
        </Card>
        <Card className="my-4">
            <Title>Where can I report issues or request new features?</Title>
            <Text>This project is managed on Github <a className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600" href="https://github.com/robertclaus/gmail-purge-assistant">here</a>. Please feel free to open an issue <a className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600" href="https://github.com/robertclaus/gmail-purge-assistant/issues">here</a> with any problems or recommendations for new features.</Text>
        </Card>
    </div>
}   