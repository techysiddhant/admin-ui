import { Card, Col, Form, Input, Row, Select, Space, Switch, Typography } from "antd"

type ProductFilterProps = {
    children?: React.ReactNode
    onFilterChange?: (filterName: string, filterValue: string) => void
}
const ProductFilter = ({ children }: ProductFilterProps) => {
    return (
        <Card >
            <Row >
                <Col span={16}>
                    <Row gutter={20}>
                        <Col span={6}>
                            <Form.Item name={"q"}>
                                <Input.Search allowClear={true} placeholder="Search" />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name={"role"}>
                                <Select style={{ width: '100%' }} allowClear={true} placeholder="Select category">
                                    <Select.Option value="pizza">Pizza</Select.Option>
                                    <Select.Option value="beverages">Beverages</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name={"tenant"}>
                                <Select style={{ width: '100%' }} allowClear={true} placeholder="Select restaurant">
                                    <Select.Option value="pizza">Pizza Hub</Select.Option>
                                    <Select.Option value="beverages">New Pizza</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name={"isPublish"}>
                                <Space>
                                    <Switch defaultChecked />
                                    <Typography.Text>Show only published</Typography.Text>
                                </Space>
                            </Form.Item>
                        </Col>
                    </Row>
                </Col>
                <Col span={8} style={{ display: 'flex', justifyContent: 'end' }}>
                    {children}
                </Col>
            </Row>

        </Card>
    )
}

export default ProductFilter