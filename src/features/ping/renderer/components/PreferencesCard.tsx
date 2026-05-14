import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@app/renderer/components/ui/card';

export function PreferencesCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferences (electron-store)</CardTitle>
        <CardDescription>Key-value storage for app settings</CardDescription>
      </CardHeader>
      <CardContent className='space-y-2'>
        <div className='flex justify-between text-xs'>
          <span className='text-muted-foreground'>theme</span>
          <span className='font-mono'>dark</span>
        </div>
        <div className='flex justify-between text-xs'>
          <span className='text-muted-foreground'>language</span>
          <span className='font-mono'>en-US</span>
        </div>
        <div className='flex justify-between text-xs'>
          <span className='text-muted-foreground'>notifications</span>
          <span className='font-mono'>true</span>
        </div>
      </CardContent>
    </Card>
  );
}
