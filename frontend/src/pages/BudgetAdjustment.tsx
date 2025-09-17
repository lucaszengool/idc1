import React from 'react';
import { Card, Typography } from 'antd';

const { Title } = Typography;

const BudgetAdjustment: React.FC = () => {
  return (
    <div>
      <Title level={2}>预算调整</Title>
      <Card>
        <p>预算调整页面正在开发中...</p>
        <p>此页面将提供预算调整功能</p>
      </Card>
    </div>
  );
};

export default BudgetAdjustment;