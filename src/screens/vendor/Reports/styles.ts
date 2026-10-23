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
  summaryIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  summaryValue: {
    ...typography.textStyles.h5,
    fontWeight: '700',
    color: colors.black,
    marginBottom: 2,
  },
  productCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.borderGray,
    marginBottom: 20,
  },
  productCardHeader: {
    marginBottom: 12,
  },
  productBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 6,
  },
  productBadgeText: {
    ...typography.textStyles.caption,
    color: colors.white,
    fontWeight: '700',
  },
  productCardTitle: {
    ...typography.textStyles.caption,
    color: colors.textSecondary,
  },
  productBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  productImage: {
    width: 64,
    height: 64,
    borderRadius: 10,
    backgroundColor: colors.lightGray,
  },
  productImagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  productMeta: {
    flex: 1,
    minWidth: 0,
  },
  productName: {
    ...typography.textStyles.body,
    fontWeight: '700',
    color: colors.black,
    marginBottom: 4,
  },
  productStat: {
    ...typography.textStyles.caption,
    color: colors.textSecondary,
  },
  emptyProduct: {
    ...typography.textStyles.body,
    color: colors.textSecondary,
  },
  pnlCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderGray,
    marginBottom: 12,
  },
  pnlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  pnlLabel: {
    ...typography.textStyles.body,
    color: colors.textSecondary,
  },
  pnlValue: {
    ...typography.textStyles.h5,
    fontWeight: '700',
  },
  pnlDivider: {
    height: 1,
    backgroundColor: colors.borderGray,
    marginVertical: 6,
  },
  pnlProfitLabel: {
    ...typography.textStyles.body,
    fontWeight: '700',
    color: colors.black,
  },
  pnlProfitValue: {
    ...typography.textStyles.h4,
    fontWeight: '700',
  },
  addExpenseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: REPORT_BLUE,
    borderRadius: 12,
    paddingVertical: 12,
    marginBottom: 24,
  },
  addExpenseButtonText: {
    ...typography.textStyles.button,
    color: colors.white,
    fontSize: 15,
  },
  expenseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.borderGray,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 8,
  },
  expenseMeta: {
    flex: 1,
    minWidth: 0,
  },
  expenseCategory: {
    ...typography.textStyles.bodySmall,
    fontWeight: '700',
    color: colors.black,
    marginBottom: 2,
  },
  expenseNote: {
    ...typography.textStyles.caption,
    color: colors.textSecondary,
  },
  expenseAmount: {
    ...typography.textStyles.bodySmall,
    fontWeight: '700',
    color: colors.black,
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
