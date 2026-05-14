import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@app/renderer/components/ui/card';

export function SQLiteCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>SQLite (better-sqlite3)</CardTitle>
        <CardDescription>Relational data storage with SQL queries</CardDescription>
      </CardHeader>
      <CardContent className='space-y-2'>
        <div className='flex justify-between text-xs'>
          <span className='text-muted-foreground'>users</span>
          <span className='font-mono'>1,247</span>
        </div>
        <div className='flex justify-between text-xs'>
          <span className='text-muted-foreground'>transactions</span>
          <span className='font-mono'>38,902</span>
        </div>
        <div className='flex justify-between text-xs'>
          <span className='text-muted-foreground'>lastBackup</span>
          <span className='font-mono'>2h ago</span>
        </div>
      </CardContent>
    </Card>
  );
}
