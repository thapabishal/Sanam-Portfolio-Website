import Script from 'next/script';

interface JsonLdProps {
  data: Record<string, any> | Array<Record<string, any>>;
}

export const JsonLd: React.FC<JsonLdProps> = ({ data }) => {
  const jsonLdString = JSON.stringify(data);
  
  return (
    <Script
      id="json-ld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLdString }}
    />
  );
};