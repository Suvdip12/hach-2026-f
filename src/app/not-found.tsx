"use client";

import Link from "next/link";
import { Home, Search } from "lucide-react";
import Container from "@/component/atoms/Container";
import Flex from "@/component/atoms/Flex";
import Typography from "@/component/atoms/Typography";
import { useTranslation } from "@/i18n";

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <Container align="center">
      <Flex
        direction="column"
        align="center"
        justify="center"
        height="100vh"
        gap="5"
      >
        <Flex gap="2" align="center">
          <Typography variant="text" size="9">
            4
          </Typography>
          <Typography variant="text" size="9">
            0
          </Typography>
          <Typography variant="text" size="9">
            4
          </Typography>
        </Flex>

        <Typography variant="heading" size="7">
          {t("notFound.title")}
        </Typography>
        <Typography variant="text" size="5" align="center">
          {t("notFound.description")}
        </Typography>

        <Flex gap="2" align="center">
          <Link href="/" className="btn btn-primary">
            <Flex gap="1" align="center">
              <Home size={20} />
              <Typography variant="text" size="5">
                {t("notFound.goHome")}
              </Typography>
            </Flex>
          </Link>
        </Flex>

        <Flex gap="2" align="center">
          <Search size={18} />
          <Typography variant="text" size="5">
            {t("notFound.searchHint")}
          </Typography>
        </Flex>
      </Flex>
    </Container>
  );
};

export default NotFound;
