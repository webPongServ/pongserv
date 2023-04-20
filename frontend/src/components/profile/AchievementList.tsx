import TabPanel from "@mui/joy/TabPanel";
import Typography from "@mui/joy/Typography";

const Achievements = () => {
  return (
    <TabPanel value={1} sx={{ p: 3 }}>
      <Typography level="inherit">
        Best for professional developers building enterprise or data-rich
        applications.
      </Typography>
      <Typography textColor="primary.400" fontSize="xl3" fontWeight="xl" my={1}>
        $15{" "}
        <Typography fontSize="sm" textColor="text.secondary" fontWeight="md">
          / dev / month
        </Typography>
      </Typography>
    </TabPanel>
  );
};

export default Achievements;
