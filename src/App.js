import './App.css';
import { useState } from 'react';
import { Button, Form, Input, Divider, Table } from 'antd';
import 'antd/dist/antd.css';

function App() {
  const [form] = Form.useForm();
  // 杭州社保基数 3957 
  // 公积金基数 2280
  const [values, setValues] = useState([]);
  const onFinish = (values) => {
    console.log('Success:', values);
    // 工资 年终奖 社保 公积金 专项 
    const { gongZi, nianZhongJiang, sheBao, gongJiJin, zhuanXiang, } = values;
    // 可计算多个工资，以逗号隔开 eg: 1000,2000
    const gongZis = String(gongZi).split(",")
    const filterValues = [];
    for (let i = 0; i < gongZis.length; i++) {
      // 每月社保
      const mSheBao = Math.floor(sheBao * 0.12);
      // 每月公积金
      const mGongJiJin = Math.floor(gongJiJin * 0.12);
      // 每月专项扣除
      const mZhuanXiang = Math.floor(zhuanXiang);
      // 每月免税金额
      const mMianShui = 5000;
      // 每月需纳税工资 = 每月工资 - 每月社保 - 每月公积金 - 每月专项扣除 - 每月免税金额
      const mNaShuiGz = Math.floor(gongZis[i]) - mSheBao - mGongJiJin - mZhuanXiang - mMianShui;
      // 全年需纳税工资
      const yNaShuiGz = mNaShuiGz * 12;
      // 全年工资需纳税金额(单独计税)
      const yNaShuiJe = getMergeMoney(yNaShuiGz);
      // 年终奖需纳税金额(单独计税)
      const nzjNaShuiJe = getAloneMoney(Math.floor(nianZhongJiang));
      // 总需纳税金额（合并计税）
      const allNaShuiMerge = getMergeMoney(yNaShuiGz + Math.floor(nianZhongJiang));
      // 总需纳税金额（单独计税）
      const allNaShuiAlone = yNaShuiJe + nzjNaShuiJe;
      // 到手工资（单独计税）
      const gzAlone = (Math.floor(gongZis[i]) + mGongJiJin - mSheBao) * 12 + Math.floor(nianZhongJiang) - allNaShuiAlone;
      // 到手工资（合并计税）
      const gzMerge = (Math.floor(gongZis[i]) + mGongJiJin - mSheBao) * 12 + Math.floor(nianZhongJiang) - allNaShuiMerge;
      filterValues.push({
        gongZi: Math.floor(gongZis[i]), // 每月工资
        sheBao: Math.floor(mSheBao), // 社保每月缴费
        gongJiJin: Math.floor(mGongJiJin), // 公积金每月缴费
        zhuanXiang: Math.floor(mZhuanXiang), // 专项扣除每月
        gzAlone: Math.floor(gzAlone), // 到手工资（单独计税）
        gzMerge: Math.floor(gzMerge) // 到手工资（合并计税）
      })
    }
    console.log(filterValues);
    setValues(filterValues);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const getMergeMoney = (naShuiGongZi) => {
    if (naShuiGongZi < 0) {
      return 0
    } else if (naShuiGongZi >= 0 && naShuiGongZi <= 36000) {
      return naShuiGongZi * 0.03
    } else if (naShuiGongZi > 36000 && naShuiGongZi <= 144000) {
      return naShuiGongZi * 0.1 - 2520
    } else if (naShuiGongZi > 144000 && naShuiGongZi <= 300000) {
      return naShuiGongZi * 0.2 - 16920
    } else if (naShuiGongZi > 300000 && naShuiGongZi <= 420000) {
      return naShuiGongZi * 0.25 - 31920
    } else if (naShuiGongZi > 420000 && naShuiGongZi <= 660000) {
      return naShuiGongZi * 0.3 - 52920
    } else if (naShuiGongZi > 660000 && naShuiGongZi <= 960000) {
      return naShuiGongZi * 0.35 - 85920
    }
    return naShuiGongZi * 0.45 - 181920
  }
  const getAloneMoney = (nianZhongJiang) => {
    if (nianZhongJiang < 0) {
      return 0
    } else if (nianZhongJiang >= 0 && nianZhongJiang <= 3000) {
      return nianZhongJiang * 0.03
    } else if (nianZhongJiang > 3000 && nianZhongJiang <= 12000) {
      return nianZhongJiang * 0.1 - 210
    } else if (nianZhongJiang > 12000 && nianZhongJiang <= 25000) {
      return nianZhongJiang * 0.2 - 1410
    } else if (nianZhongJiang > 25000 && nianZhongJiang <= 35000) {
      return nianZhongJiang * 0.25 - 2660
    } else if (nianZhongJiang > 35000 && nianZhongJiang <= 55000) {
      return nianZhongJiang * 0.3 - 4410
    } else if (nianZhongJiang > 55000 && nianZhongJiang <= 80000) {
      return nianZhongJiang * 0.35 - 7160
    }
    return nianZhongJiang * 0.45 - 15160
  }
  const gzRange = [];
  for (let i = 1; i < 101; i++) { gzRange.push(1000 * i) }
  const columns = [
    {
      title: '合同工资每月/每年',
      key: 'gongZi',
      render: (row) => <span>{row.gongZi}/{row.gongZi * 12}</span>,
    },
    {
      title: '社保缴费每月/每年',
      key: 'sheBao',
      render: (row) => <span>{row.sheBao}/{row.sheBao * 12}</span>,
    },
    {
      title: '公积金缴费每月/每年',
      key: 'gongJiJin',
      render: (row) => <span>{row.gongJiJin}/{row.gongJiJin * 12}</span>,
    },
    {
      title: '公积金双边每月/每年',
      key: 'mGongJiJins',
      render: (row) => <span>{row.gongJiJin * 2}/{row.gongJiJin * 2 * 12}</span>,
    },
    {
      title: '专项每月/每年',
      key: 'zhuanXiang',
      render: (row) => <span>{row.zhuanXiang}/{row.zhuanXiang * 12}</span>,
    },
    {
      title: '到手（单独计税）',
      dataIndex: 'gzAlone',
      key: 'gzAlone',
    },
    {
      title: '到手（合并计税）',
      dataIndex: 'gzMerge',
      key: 'gzMerge',
    },
  ];
  return (
    <div className='App'>
      <p>社保：3957，公积金：2280，专项1500</p>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        form={form}
      >
        <Form.Item
          label="工资/每月"
          name="gongZi"
        >
          <Input placeholder='工资，可以,分割计算多个工资' className="ipt" type="number" />
        </Form.Item>

        <Form.Item
          label="社保基数"
          name="sheBao"
        >
          <Input className="ipt" type="number" />
        </Form.Item>
        <Form.Item
          label="公积金基数"
          name="gongJiJin"
        >
          <Input className="ipt" type="number" />
        </Form.Item>
        <Form.Item
          label="专项扣除/每月"
          name="zhuanXiang"
        >
          <Input className="ipt" type="number" />
        </Form.Item>
        <Form.Item
          label="年终奖金额"
          name="nianZhongJiang"
        >
          <Input className="ipt" type="number" />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Ai 自动计算
          </Button>
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button onClick={() => {
            form.setFieldsValue({
              gongZi: 10000,
              sheBao: 3957,
              gongJiJin: 2280,
              zhuanXiang: 1500,
              nianZhongJiang: 0,
            })
          }}>按照杭州最低标准一键填入10000</Button>

        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button onClick={() => {
            form.setFieldsValue({
              gongZi: 21000,
              sheBao: 3957,
              gongJiJin: 17000,
              zhuanXiang: 1500,
              nianZhongJiang: 63000,
            })
          }}>按照三个月奖金</Button>
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button onClick={() => {
            form.setFieldsValue({
              gongZi: 21000,
              sheBao: 3957,
              gongJiJin: 17000,
              zhuanXiang: 1500,
              nianZhongJiang: 105000,
            })
          }}>按照五个月奖金</Button>
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button onClick={() => {
            form.setFieldsValue({
              gongZi: gzRange.join(","),
              sheBao: 3957,
              gongJiJin: 2280,
              zhuanXiang: 1500
            })
          }}>按照杭州最低标准一键填入多个数据1000-100000</Button>
        </Form.Item>
      </Form>
      <Divider />
      <Table dataSource={values} expandable={{
        expandedRowRender: record => <p style={{ margin: 0 }}>{record.gongJiJin}</p>,
      }} columns={columns} pagination={{
        defaultPageSize: 100
      }} />;
    </div>
  );
}

export default App;
