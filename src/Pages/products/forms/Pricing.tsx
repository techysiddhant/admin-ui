import { Card, Col, Form, InputNumber, Row, Space, Typography } from "antd"
import { Category } from "../../../types"

type PricingProps = {
    selectedCategory: string;

}
const Pricing = ({ selectedCategory }: PricingProps) => {
    // console.log(selectedCategory);
    const category: Category | null = selectedCategory ? JSON.parse(selectedCategory) : null;

    if (!category) {
        return null
    }
    return (
        <Card bordered={false} title={<Typography.Text>Product Price</Typography.Text>}>
            {
                Object.entries(category.priceConfiguration).map(([key, value]) => (
                    <div key={key}>
                        <Space direction="vertical" size={'large'} style={{ width: '100%' }}>
                            <Typography.Text strong style={{ textTransform: 'capitalize' }}>{`${key} (${value.priceType})`}</Typography.Text>
                            <Row gutter={20}>
                                {
                                    value.availableOptions.map((option: string) => (
                                        <Col span={8} key={option}>
                                            <Form.Item label={option} name={['priceConfiguration', JSON.stringify({ configurationKey: key, priceType: value.priceType }), option]}>
                                                <InputNumber addonAfter="₹" />
                                            </Form.Item>
                                        </Col>
                                    ))
                                }

                            </Row>
                        </Space>
                    </div>
                ))
            }
        </Card>
    )
}

export default Pricing