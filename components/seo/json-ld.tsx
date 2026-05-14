export function JsonLd<T extends object>({ data }: { data: T }) {
  // Escape `<` as `<` so a `</script>` substring in any string field cannot
  // break out of the inline script tag (JSON.stringify alone does not escape it).
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
