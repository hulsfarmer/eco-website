#!/usr/bin/env npx tsx

import { execSync } from 'child_process';

async function testAllSystems() {
  console.log('🌍 EcoLife 전체 시스템 통합 테스트 시작...\n');
  
  const phases = [
    {
      name: 'Phase 2: 자동 콘텐츠 수집 시스템',
      script: 'npx tsx src/scripts/test-phase2.ts',
      emoji: '📰'
    },
    {
      name: 'Phase 3: AI 콘텐츠 생성 엔진',
      script: 'npx tsx src/scripts/test-phase3.ts',
      emoji: '🤖'
    },
    {
      name: 'Phase 4: 자동 발행 및 최적화',
      script: 'npx tsx src/scripts/test-phase4.ts',
      emoji: '🚀'
    },
    {
      name: 'Phase 5: 수익 최적화 시스템',
      script: 'npx tsx src/scripts/test-phase5.ts',
      emoji: '💰'
    }
  ];

  const results: { phase: string; status: 'success' | 'failed'; error?: string }[] = [];

  for (const phase of phases) {
    console.log(`${phase.emoji} ${phase.name} 테스트 중...`);
    console.log('='.repeat(50));
    
    try {
      execSync(phase.script, { 
        stdio: 'inherit',
        cwd: process.cwd()
      });
      
      results.push({ phase: phase.name, status: 'success' });
      console.log(`✅ ${phase.name} 테스트 성공!\n`);
      
    } catch (error) {
      results.push({ 
        phase: phase.name, 
        status: 'failed', 
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      console.error(`❌ ${phase.name} 테스트 실패!\n`);
    }
  }

  // 최종 결과 요약
  console.log('\n🎯 전체 시스템 테스트 결과 요약');
  console.log('='.repeat(60));
  
  const successCount = results.filter(r => r.status === 'success').length;
  const totalCount = results.length;
  
  results.forEach(result => {
    const icon = result.status === 'success' ? '✅' : '❌';
    console.log(`${icon} ${result.phase}`);
    if (result.error) {
      console.log(`   오류: ${result.error}`);
    }
  });
  
  console.log('\n📊 시스템 상태:');
  console.log(`   성공: ${successCount}/${totalCount} 단계`);
  console.log(`   성공률: ${Math.round((successCount / totalCount) * 100)}%`);
  
  if (successCount === totalCount) {
    console.log('\n🎉 모든 시스템이 정상적으로 작동합니다!');
    console.log('🚀 EcoLife 자동화 환경 웹사이트가 준비되었습니다.');
    console.log('\n📋 다음 단계:');
    console.log('   1. Google AdSense 승인 신청');
    console.log('   2. 실제 API 키 설정 (.env.local)');
    console.log('   3. 도메인 연결 및 SSL 설정');
    console.log('   4. 본격적인 자동화 운영 시작');
    console.log('\n💡 시스템 모니터링: http://localhost:3000');
  } else {
    console.log('\n⚠️ 일부 시스템에서 문제가 발견되었습니다.');
    console.log('   SETUP.md 파일을 참조하여 문제를 해결하세요.');
  }
  
  process.exit(successCount === totalCount ? 0 : 1);
}

testAllSystems();