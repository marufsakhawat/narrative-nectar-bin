import { Helmet } from "react-helmet-async";

interface SeoProps {
  title: string;
  description?: string;
  path?: string;
  type?: "website" | "article";
  image?: string;
  jsonLd?: object | object[];
}

const Seo = ({
  title,
  description = "MsDevs Insights — B2B marketing, sales enablement, and customer success insights from the MsDevs Insights team.",
  path = "/",
  type = "website",
  image,
  jsonLd,
}: SeoProps) => {
  const fullTitle = title.includes("MsDevs Insights") ? title : `${title} — MsDevs Insights`;
  const jsonLdArray = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={path} />

      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={path} />
      {image && <meta property="og:image" content={image} />}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}

      {jsonLdArray.map((schema, i) => (
        <script type="application/ld+json" key={i}>
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};

export default Seo;
