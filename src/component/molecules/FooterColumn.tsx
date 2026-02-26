import Link from "next/link";
import Flex from "../atoms/Flex";
import Typography from "../atoms/Typography";
import "./css/FooterColumn.css";

export type FooterColumnProps = {
  title: string;
  links: {
    id: number;
    name: string;
    link: string;
  }[];
};

export default function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <Flex direction="column" gap="3" className="footer-column">
      <Typography variant="heading" size="4" className="column-title">
        {title}
      </Typography>
      <Flex direction="column" gap="2" className="column-links">
        {links.map((link) => (
          <Link key={link.id} href={`/${link.link}`} className="footer-link">
            <Typography variant="text" size="2">
              {link.name}
            </Typography>
          </Link>
        ))}
      </Flex>
    </Flex>
  );
}
