"use client";

import {
  Container,
  Heading,
  Card,
  Flex,
  Table,
  Text,
  Switch,
  Badge,
  TextField,
} from "@radix-ui/themes";
import SuperAdminNav from "@/component/organisms/SuperAdminNav";
import { useState, useEffect } from "react";
import {
  packagesApi,
  extractData,
  type SchoolWithPackages,
} from "@/services/api.service";
import { Package, Search, Code, Bot, Brain, Lightbulb } from "lucide-react";
import toast from "react-hot-toast";

export default function PackagesPage() {
  const [schools, setSchools] = useState<SchoolWithPackages[]>([]);
  const [filteredSchools, setFilteredSchools] = useState<SchoolWithPackages[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingPackage, setUpdatingPackage] = useState<string | null>(null);

  useEffect(() => {
    fetchSchoolsWithPackages();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = schools.filter(
        (school) =>
          school.schoolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          school.domain.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setFilteredSchools(filtered);
    } else {
      setFilteredSchools(schools);
    }
  }, [searchTerm, schools]);

  const fetchSchoolsWithPackages = async () => {
    try {
      setLoading(true);
      const res = await packagesApi.getAllSchoolsWithPackages();
      const data = extractData(res);
      if (Array.isArray(data)) {
        setSchools(data);
        setFilteredSchools(data);
      }
    } catch (error) {
      console.error("Error fetching packages:", error);
      toast.error("Failed to load packages");
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePackage = async (
    schoolId: string,
    packageName: string,
    currentValue: boolean | null,
  ) => {
    const key = `${schoolId}-${packageName}`;
    setUpdatingPackage(key);

    try {
      await packagesApi.toggle(schoolId, packageName, !currentValue);
      toast.success(
        `${packageName} ${!currentValue ? "enabled" : "disabled"} successfully`,
      );

      // Update local state
      setSchools((prev) =>
        prev.map((school) =>
          school.schoolId === schoolId
            ? { ...school, [packageName]: !currentValue }
            : school,
        ),
      );
    } catch (error) {
      console.error("Error toggling package:", error);
      toast.error("Failed to update package");
    } finally {
      setUpdatingPackage(null);
    }
  };

  const getPackageIcon = (packageName: string) => {
    switch (packageName) {
      case "curioCode":
        return <Code size={16} />;
      case "curioAi":
        return <Brain size={16} />;
      case "curioBot":
        return <Bot size={16} />;
      case "curioThink":
        return <Lightbulb size={16} />;
      default:
        return <Package size={16} />;
    }
  };

  const packageNames = [
    "curioCode",
    "curioAi",
    "curioBot",
    "curioThink",
  ] as const;

  return (
    <Container size="4" className="py-20">
      <SuperAdminNav />
      <Flex direction="column" gap="6">
        {/* Header */}
        <Card>
          <Flex justify="between" align="center" p="4">
            <Flex align="center" gap="3">
              <Package size={24} />
              <Heading size="6">Package Management</Heading>
            </Flex>
            <Badge size="2" color="blue">
              {schools.length} Schools
            </Badge>
          </Flex>
        </Card>

        {/* Search */}
        <Card>
          <Flex p="4" gap="3" align="center">
            <Search size={20} />
            <TextField.Root
              placeholder="Search schools by name or domain..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ flex: 1 }}
            />
          </Flex>
        </Card>

        {/* Package Legend */}
        <Card>
          <Flex p="4" gap="4" wrap="wrap">
            {packageNames.map((pkg) => (
              <Flex key={pkg} align="center" gap="2">
                {getPackageIcon(pkg)}
                <Text size="2" weight="medium">
                  {pkg}
                </Text>
              </Flex>
            ))}
          </Flex>
        </Card>

        {/* Schools Table */}
        <Card>
          {loading ? (
            <Flex justify="center" align="center" p="6">
              <Text>Loading...</Text>
            </Flex>
          ) : (
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell>School</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Domain</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell align="center">
                    <Flex align="center" gap="1" justify="center">
                      <Code size={14} /> EasyCode
                    </Flex>
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell align="center">
                    <Flex align="center" gap="1" justify="center">
                      <Brain size={14} /> EasyAI
                    </Flex>
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell align="center">
                    <Flex align="center" gap="1" justify="center">
                      <Bot size={14} /> EasyBot
                    </Flex>
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell align="center">
                    <Flex align="center" gap="1" justify="center">
                      <Lightbulb size={14} /> EasyThink
                    </Flex>
                  </Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {filteredSchools.map((school) => (
                  <Table.Row key={school.schoolId}>
                    <Table.Cell>
                      <Text weight="medium">{school.schoolName}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge variant="soft" color="gray">
                        {school.domain}
                      </Badge>
                    </Table.Cell>
                    {packageNames.map((pkg) => (
                      <Table.Cell key={pkg} align="center">
                        <Switch
                          checked={school[pkg] ?? false}
                          disabled={
                            updatingPackage === `${school.schoolId}-${pkg}`
                          }
                          onCheckedChange={() =>
                            handleTogglePackage(
                              school.schoolId,
                              pkg,
                              school[pkg],
                            )
                          }
                        />
                      </Table.Cell>
                    ))}
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          )}

          {!loading && filteredSchools.length === 0 && (
            <Flex justify="center" align="center" p="6">
              <Text color="gray">No schools found</Text>
            </Flex>
          )}
        </Card>
      </Flex>
    </Container>
  );
}
