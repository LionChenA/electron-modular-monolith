import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@app/renderer/components/ui/card';

export function OramaSearchCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Search (Orama)</CardTitle>
        <CardDescription>Full-text search powered by Orama</CardDescription>
      </CardHeader>
      <CardContent className='space-y-2'>
        <div className='flex justify-between text-xs'>
          <span className='text-muted-foreground'>indexedDocs</span>
          <span className='font-mono'>4,521</span>
        </div>
        <div className='flex justify-between text-xs'>
          <span className='text-muted-foreground'>avgLatency</span>
          <span className='font-mono'>2.3ms</span>
        </div>
        <div className='flex justify-between text-xs'>
          <span className='text-muted-foreground'>lastIndex</span>
          <span className='font-mono'>just now</span>
        </div>
      </CardContent>
    </Card>
  );
}
