import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@app/renderer/components/ui/card';

export function SecretsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Secrets (SafeStorage)</CardTitle>
        <CardDescription>OS-level encryption for sensitive data</CardDescription>
      </CardHeader>
      <CardContent className='space-y-2'>
        <div className='flex justify-between text-xs'>
          <span className='text-muted-foreground'>apiKey</span>
          <span className='font-mono'>••••••••</span>
        </div>
        <div className='flex justify-between text-xs'>
          <span className='text-muted-foreground'>dbPassword</span>
          <span className='font-mono'>••••••••</span>
        </div>
        <div className='flex justify-between text-xs'>
          <span className='text-muted-foreground'>sessionToken</span>
          <span className='font-mono'>••••••••</span>
        </div>
      </CardContent>
    </Card>
  );
}
