import { Card, Col, Form, Radio, Row, Switch, Typography } from "antd"
import { Attribute, Category } from "../../../types";
import { useQuery } from "@tanstack/react-query";
import { getCategory } from "../../../http/api";

type AttributesProps = {
    selectedCategory: string | null
}
const Attributes = ({ selectedCategory }: AttributesProps) => {
    const { data: fetchedCategory } = useQuery<Category>({
        queryKey: ['category', selectedCategory],
        queryFn: async () => {
            return getCategory(selectedCategory!).then((res) => res.data);
        },
        staleTime: 1000 * 60 * 5
    })
    if (!fetchedCategory) {
        return null
    }
    return (
        <Card bordered={false} title={<Typography.Text>Product Price</Typography.Text>}>
            {
                fetchedCategory.attributes.map((attribute: Attribute) => (
                    <div key={attribute.name}>
                        {
                            attribute.widgetType === "radio" ? (
                                <Form.Item label={attribute.name} name={['attributes', attribute.name]} initialValue={attribute.defaultValue} rules={[
                                    {
                                        required: true,
                                        message: `${attribute.name} is required`
                                    }
                                ]}>
                                    <Radio.Group>
                                        {
                                            attribute.availableOptions.map((option: string) => (
                                                <Radio.Button key={option} value={option}>{option}</Radio.Button>
                                            ))
                                        }
                                    </Radio.Group>
                                </Form.Item>
                            ) : attribute.widgetType === "switch" ? (
                                <Row>
                                    <Col>
                                        <Form.Item label={attribute.name} name={['attributes', attribute.name]} valuePropName="checked" initialValue={attribute.defaultValue}>
                                            <Switch checkedChildren="Yes" unCheckedChildren="No" />
                                        </Form.Item>
                                    </Col>
                                </Row>

                            ) : null
                        }

                    </div>
                ))
            }
        </Card>
    )
}

export default Attributes