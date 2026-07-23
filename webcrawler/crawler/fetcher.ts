export default async function fetch(url: string): Promise<string> {
  const html = await fetch(url).then((res) => res.toString());
  return html;
}
