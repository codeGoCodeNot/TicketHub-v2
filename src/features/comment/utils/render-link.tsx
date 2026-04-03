import Link from "next/link";

const renderLink = ({ attributes, content }: any) => {
  const { href, ...props } = attributes;

  const isInternal = href.includes(window.location.origin);
  const url = isInternal ? href.replace(window.location.origin, "") : href;

  let maybeParsedContent = content;
  if (url.startsWith("/tickets/"))
    maybeParsedContent = url.replace("/tickets/", "Ticket #");

  const handleClick = (event: React.SyntheticEvent) => {
    if (isInternal) return;

    if (!confirm("You are about to leave the site. Continue?")) {
      event.preventDefault();
    }
  };

  return (
    <Link href={url} {...props} onClick={handleClick}>
      {maybeParsedContent}
    </Link>
  );
};

export default renderLink;
