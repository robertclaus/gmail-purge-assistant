'use client';
import { Card, Title, Text } from '@tremor/react';
import Purger from './purger';
import { SessionProvider } from "next-auth/react";

export default async function IndexPage({}:{}) {
  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <Title>Gmail Purge Assistant</Title>
      <Text>This tool analyzes your email to find groups of emails that can be deleted to recover space.</Text>
      <Card className="mt-6">
        <SessionProvider>
          <Purger />
        </SessionProvider>
      </Card>
    </main>
  );
}
