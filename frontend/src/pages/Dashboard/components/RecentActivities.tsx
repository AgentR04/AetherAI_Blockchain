import {
  Box,
  Chip,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledListItem = styled(ListItem)(({ theme }) => ({
  borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
  padding: theme.spacing(2),
  "&:last-child": {
    borderBottom: "none",
  },
}));

interface Activity {
  id: string;
  type:
    | "transaction"
    | "risk_assessment"
    | "anomaly"
    | "liquidity"
    | "authentication";
  title: string;
  details: string;
  timestamp: string;
  riskScore?: number;
  biometricConfidence?: number;
}

const mockActivities: Activity[] = [
  {
    id: "NFR53.495",
    type: "risk_assessment",
    title: "Risk Assessment Update",
    details: "Transaction risk level decreased",
    timestamp: "2m ago",
    riskScore: 0.15,
  },
  {
    id: "NFR15.9",
    type: "authentication",
    title: "Biometric Authentication",
    details: "Successful login verification",
    timestamp: "5m ago",
    biometricConfidence: 0.95,
  },
  {
    id: "NFR51.078",
    type: "anomaly",
    title: "Anomaly Detection",
    details: "Unusual transaction pattern detected",
    timestamp: "15m ago",
    riskScore: 0.75,
  },
  {
    id: "NFR55",
    type: "liquidity",
    title: "Pool Optimization",
    details: "AI-driven range adjustment",
    timestamp: "30m ago",
  },
  {
    id: "NFR49",
    type: "risk_assessment",
    title: "Risk Assessment Update",
    details: "New transaction pattern analyzed",
    timestamp: "1h ago",
    riskScore: 0.35,
  },
];

const getChipColor = (type: Activity["type"], success?: boolean) => {
  if (type === "transaction") {
    return success ? "#4CAF50" : "#FF5252";
  }

  switch (type) {
    case "risk_assessment":
      return "#4CAF50";
    case "anomaly":
      return "#FF5252";
    case "liquidity":
      return "#2196F3";
    case "authentication":
      return "#FFA726";
    default:
      return "#757575";
  }
};

const RecentActivities = () => {
  return (
    <List disablePadding>
      {mockActivities.map((activity: Activity) => (
        <StyledListItem key={activity.id}>
          <ListItemText
            primary={
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="subtitle1" color="white">
                    {activity.title}
                  </Typography>
                  <Chip
                    label={activity.id}
                    size="small"
                    sx={{ bgcolor: "rgba(255, 255, 255, 0.1)", color: "white" }}
                  />
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {activity.timestamp}
                </Typography>
              </Box>
            }
            secondary={
              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  {activity.details}
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Chip
                    label={activity.type.replace("_", " ")}
                    size="small"
                    sx={{
                      bgcolor: getChipColor(activity.type),
                      color: "white",
                    }}
                  />
                  {activity.riskScore !== undefined && (
                    <Chip
                      label={`Risk Score: ${(activity.riskScore * 100).toFixed(
                        0
                      )}%`}
                      size="small"
                      sx={{
                        bgcolor:
                          activity.riskScore < 0.3
                            ? "#4CAF50"
                            : activity.riskScore < 0.6
                            ? "#FFA726"
                            : "#FF5252",
                        color: "white",
                      }}
                    />
                  )}
                  {activity.biometricConfidence !== undefined && (
                    <Chip
                      label={`Biometric Confidence: ${(
                        activity.biometricConfidence * 100
                      ).toFixed(0)}%`}
                      size="small"
                      sx={{
                        bgcolor:
                          activity.biometricConfidence > 0.8
                            ? "#4CAF50"
                            : "#FFA726",
                        color: "white",
                      }}
                    />
                  )}
                </Box>
              </Box>
            }
          />
        </StyledListItem>
      ))}
    </List>
  );
};

export default RecentActivities;
