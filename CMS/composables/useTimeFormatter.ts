export function formatAMPM(date: Date): string {
  let hours = date.getHours();
  let minutes: string | number = date.getMinutes(); 
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  return `${hours}:${minutes} ${ampm}`;
}