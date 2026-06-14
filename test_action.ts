import { getAIChatResponseAction } from './src/lib/actions';

async function main() {
  console.log('Invoking getAIChatResponseAction("Recommend Courses")...');
  try {
    const res = await getAIChatResponseAction('Recommend Courses');
    console.log('Result:', JSON.stringify(res, null, 2));
  } catch (err: any) {
    console.error('Action failed with exception:', err);
  }
}

main();
