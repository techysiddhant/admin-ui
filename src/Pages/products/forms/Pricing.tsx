import { Card, Col, Form, InputNumber, Row, Space, Typography } from "antd"
import { Category } from "../../../types"
import { useQuery } from "@tanstack/react-query";
import { getCategory } from "../../../http/api";

type PricingProps = {
    selectedCategory: string;

}
const Pricing = ({ selectedCategory }: PricingProps) => {
    // console.log(selectedCategory);
    // const category: Category | null = selectedCategory ? JSON.parse(selectedCategory) : null;
    const { data: fetchedCategory } = useQuery<Category>({
        queryKey: ['category', selectedCategory],
        queryFn: async () => {
            return getCategory(selectedCategory).then((res) => res.data);
        },
        staleTime: 1000 * 60 * 5
    })
    if (!fetchedCategory) {
        return null
    }
    return (
        <Card bordered={false} title={<Typography.Text>Product Price</Typography.Text>}>
            {
                Object.entries(fetchedCategory.priceConfiguration).map(([key, value]) => (
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