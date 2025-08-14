import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import DataCollector from '@/lib/data-collector';

// 환경 데이터 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dataType = searchParams.get('type');
    const region = searchParams.get('region');
    const days = parseInt(searchParams.get('days') || '7');
    
    // 날짜 범위 설정
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    
    // 필터 조건 구성
    const where: any = {
      recordedAt: { gte: startDate }
    };
    
    if (dataType) {
      where.dataType = dataType;
    }
    
    if (region) {
      where.region = region;
    }
    
    // 데이터 조회
    const environmentalData = await prisma.environmentalData.findMany({
      where,
      orderBy: { recordedAt: 'desc' },
      take: 100
    });
    
    // 데이터 타입별 최신 값들
    const latestData = await prisma.environmentalData.findMany({
      orderBy: { recordedAt: 'desc' },
      distinct: ['dataType', 'region'],
      take: 20
    });
    
    // 데이터 그룹화
    const groupedData: Record<string, any> = {};
    
    latestData.forEach(data => {
      const key = data.region === 'global' ? data.dataType : `${data.dataType}_${data.region}`;
      groupedData[key] = {
        ...data,
        formattedValue: formatEnvironmentalValue(data.dataType, data.value, data.unit)
      };
    });
    
    // 시계열 데이터 (차트용)
    const timeSeriesData = groupEnvironmentalDataByDate(environmentalData);
    
    return NextResponse.json({
      success: true,
      data: {
        latest: groupedData,
        timeSeries: timeSeriesData,
        totalRecords: environmentalData.length
      }
    });
    
  } catch (error) {
    console.error('❌ Environmental data API error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch environmental data',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// 환경 데이터 수집 트리거
export async function POST(request: NextRequest) {
  try {
    const dataCollector = new DataCollector();
    
    console.log('🌍 Manual environmental data collection triggered');
    
    const results = await dataCollector.collectAllEnvironmentalData();
    
    return NextResponse.json({
      success: true,
      message: 'Environmental data collection completed',
      data: results,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Environmental data collection error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to collect environmental data',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// 환경 데이터 값 포맷팅
function formatEnvironmentalValue(dataType: string, value: number, unit: string): string {
  switch (dataType) {
    case 'global_temperature_anomaly':
      return `+${value.toFixed(2)}°C`;
    case 'co2_concentration':
      return `${value.toFixed(1)} ppm`;
    case 'renewable_energy_share':
      return `${value.toFixed(1)}%`;
    case 'sea_level_rise':
      return `+${value.toFixed(1)} cm`;
    case 'arctic_sea_ice_extent':
      return `${value.toFixed(2)} M km²`;
    case 'city_temperature':
      return `${value.toFixed(1)}°C`;
    default:
      return `${value.toFixed(2)} ${unit}`;
  }
}

// 날짜별 환경 데이터 그룹화
function groupEnvironmentalDataByDate(data: any[]) {
  const grouped: Record<string, Record<string, number>> = {};
  
  data.forEach(record => {
    const dateKey = record.recordedAt.toISOString().split('T')[0]; // YYYY-MM-DD
    
    if (!grouped[dateKey]) {
      grouped[dateKey] = {};
    }
    
    const dataKey = record.region === 'global' ? record.dataType : `${record.dataType}_${record.region}`;
    
    // 같은 날 같은 데이터 타입의 평균값 계산
    if (grouped[dateKey][dataKey]) {
      grouped[dateKey][dataKey] = (grouped[dateKey][dataKey] + record.value) / 2;
    } else {
      grouped[dateKey][dataKey] = record.value;
    }
  });
  
  // 날짜순 정렬
  const sortedDates = Object.keys(grouped).sort();
  
  return sortedDates.map(date => ({
    date,
    ...grouped[date]
  }));
}