import { Dimensions, StyleSheet } from 'react-native';
import { colors, typography } from '../../../theme';

const REPORT_BLUE = '#2563EB';
const TREND_GREEN = '#22C55E';
const TREND_RED = '#DC2626';

const { width: screenWidth } = Dimensions.get('window');
const cardGap = 12;
const padding = 16;
const cardWidth = (screenWidth - padding * 2 - cardGap) / 2;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    paddingHorizontal: padding,
    paddingTop: 16,
    paddingBottom: 100,
  },
  sectionTitle: {
    ...typography.textStyles.h5,
    fontWeight: '700',
    color: colors.black,
    marginBottom: 12,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
    gap: cardGap,
  },
  summaryCard: {
    width: cardWidth,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.borderGray,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },
  summaryLabel: {
    ...typography.textStyles.caption,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  summaryValue: {
    ...typography.textStyles.h5,
    fontWeight: '700',
    color: colors.black,
    marginBottom: 2,
  },
  trendUp: {
    ...typography.textStyles.caption,
    color: TREND_GREEN,
    fontWeight: '600',
  },
  trendDown: {
    ...typography.textStyles.caption,
    color: TREND_RED,
    fontWeight: '600',
  },
  chartSection: {
    marginBottom: 24,
  },
  chartWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.background,
    paddingVertical: 8,
  },
  chartLegend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    ...typography.textStyles.caption,
    color: colors.textSecondary,
  },
  donutWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  donutCenterCircle: {
    position: 'absolute',
    backgroundColor: colors.white,
    borderRadius: 999,
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: REPORT_BLUE,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    marginHorizontal: padding,
    marginBottom: 24,
  },
  exportButtonText: {
    ...typography.textStyles.button,
    color: colors.white,
    fontSize: 16,
  },
});

export const CHART_WIDTH = screenWidth - padding * 2;
export const CHART_HEIGHT = 200;
export const DONUT_SIZE = 160;
export const DONUT_CENTER_RADIUS = 45;
