import { Card, Col, Input, Row, Select } from "antd"
import React from "react"
import { Form } from "antd"
type UsersFilterProps = {
    children?: React.ReactNode
    onFilterChange?: (filterName: string, filterValue: string) => void
}
const UserFilter = ({ children }: UsersFilterProps) => {
    return (
        <Card>
            <Row justify={'space-between'}>
                <Col span={16}>
                    <Row gutter={20}>
                        <Col span={8}>
                            <Form.Item name={"q"}>
                                <Input.Search allowClear={true} placeholder="Search" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name={"role"}>
                                <Select style={{ width: '100%' }} allowClear={true} placeholder="Select Role">
                                    <Select.Option value="admin">Admin</Select.Option>
                                    <Select.Option value="manager">Manager</Select.Option>
                                    <Select.Option value="customer">Customer</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        {/* <Col span={8}>
                            <Select style={{ width: '100%' }}  allowClear={true} placeholder="Status">
                                <Select.Option value="active">Active</Select.Option>
                                <Select.Option value="banned">Banned</Select.Option>
                            </Select>
                        </Col> */}
                    </Row>
                </Col>
                <Col span={8} style={{ display: 'flex', justifyContent: 'end' }}>
                    {children}
                </Col>
            </Row>
        </Card>
    )
}

export default UserFilter