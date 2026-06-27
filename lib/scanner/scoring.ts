import type { BigSixCounts } from '@/types/scan';

export function calculateComplianceScore(
  violations: Array<{ impact: string }>
): { score: number; color: string; label: string } {
  let score = 100;
  let criticalDeductions = 0;
  let seriousDeductions = 0;
  let moderateDeductions = 0;
  let minorDeductions = 0;

  for (const v of violations) {
    switch (v.impact) {
      case 'critical':
        criticalDeductions += 8;
        break;
      case 'serious':
        seriousDeductions += 4;
        break;
      case 'moderate':
        moderateDeductions += 2;
        break;
      case 'minor':
        minorDeductions += 0.5;
        break;
    }
  }

  // Cap deductions
  score -= Math.min(criticalDeductions, 40);
  score -= Math.min(seriousDeductions, 30);
  score -= Math.min(moderateDeductions, 20);
  score -= Math.min(minorDeductions, 10);

  const finalScore = Math.max(0, Math.round(score));

  let color: string;
  let label: string;

  if (finalScore >= 90) {
    color = '#2DD4BF';
    label = 'Excellent';
  } else if (finalScore >= 75) {
    color = '#22D3A0';
    label = 'Good';
  } else if (finalScore >= 50) {
    color = '#F59E0B';
    label = 'Needs Work';
  } else {
    color = '#EF4444';
    label = 'Poor';
  }

  return { score: finalScore, color, label };
}

export function calculateBigSix(violations: Array<{ rule_id: string }>): BigSixCounts {
  const bigSix: BigSixCounts = {
    contrast: 0,
    alt_text: 0,
    labels: 0,
    links: 0,
    buttons: 0,
    lang: 0,
  };

  for (const v of violations) {
    switch (v.rule_id) {
      case 'color-contrast':
        bigSix.contrast++;
        break;
      case 'image-alt':
      case 'image-redundant-alt':
        bigSix.alt_text++;
        break;
      case 'label':
      case 'label-title-only':
        bigSix.labels++;
        break;
      case 'link-name':
        bigSix.links++;
        break;
      case 'button-name':
        bigSix.buttons++;
        break;
      case 'html-has-lang':
      case 'html-lang-valid':
        bigSix.lang++;
        break;
    }
  }

  return bigSix;
}
