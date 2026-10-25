import React, { useCallback, useMemo, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Handle,
  Position,
  addEdge,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const initialNodes = [
  {
    id: '1',
    type: 'flowNode',
    position: { x: 180, y: 60 },
    data: {
      kind: 'trigger',
      title: 'কাস্টমার মেসেজ (Trigger)',
      content: 'ইউজার মেসেজে দাম কত / Price লিখলে',
      keyword: 'দাম কত / Price',
    },
  },
  {
    id: '2',
    type: 'flowNode',
    position: { x: 180, y: 260 },
    data: {
      kind: 'message',
      title: 'অটো রিপ্লাই (Text Message)',
      content: 'ধন্যবাদ আমাদের নক করার জন্য! আমাদের প্রডাক্টের মূল্য ১,৫০০ টাকা।',
    },
  },
];

const initialEdges = [];

const nodeInfo = {
  trigger: {
    title: 'নতুন Trigger',
    content: 'কোন মেসেজ এলে ফ্লো চালু হবে?',
    icon: '⚡',
    color: '#f59e0b',
  },
  message: {
    title: 'নতুন Text Message',
    content: 'এখানে আপনার মেসেজ লিখুন...',
    icon: '💬',
    color: '#38bdf8',
  },
  condition: {
    title: 'শর্ত (If / Else)',
    content: 'শর্ত লিখুন, যেমন: মেসেজে price আছে',
    icon: '🔀',
    color: '#c084fc',
  },
  delay: {
    title: 'Delay',
    content: 'অপেক্ষার সময়: ৫ সেকেন্ড',
    icon: '⏱️',
    color: '#34d399',
  },
};

function FlowNode({ data, selected }) {
  const info = nodeInfo[data.kind] || nodeInfo.message;

  return (
    <div
      style={{
        width: 250,
        background: '#0f172a',
        color: '#e2e8f0',
        border: `2px solid ${selected ? info.color : '#334155'}`,
        borderRadius: 12,
        boxShadow: selected ? `0 0 16px ${info.color}35` : '0 6px 18px #0005',
        overflow: 'visible',
        fontFamily: 'inherit',
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: '#f59e0b', width: 10, height: 10 }}
      />

      <div
        style={{
          padding: '10px 12px',
          borderBottom: '1px solid #334155',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <span>{info.icon}</span>
        <strong style={{ fontSize: 12, color: info.color }}>
          {data.title || info.title}
        </strong>
      </div>

      <div style={{ padding: 12, fontSize: 12, lineHeight: 1.6 }}>
        <div style={{ color: '#94a3b8', marginBottom: 5 }}>
          {data.kind.toUpperCase()}
        </div>
        {data.kind === 'trigger' && data.keyword && (
          <div style={{ color: '#fbbf24', marginBottom: 5 }}>
            Keyword: {data.keyword}
          </div>
        )}
        <div style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>
          {data.content}
        </div>
        {data.kind === 'condition' && (
          <div style={{ marginTop: 8, color: '#c084fc' }}>
            YES / NO
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: info.color, width: 10, height: 10 }}
      />
    </div>
  );
}

export default function FlowBuilder() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNodeId, setSelectedNodeId] = useState('2');

  const selectedNode = nodes.find((node) => node.id === selectedNodeId);

  const nodeTypes = useMemo(() => ({ flowNode: FlowNode }), []);

  const onConnect = useCallback(
    (connection) =>
      setEdges((currentEdges) =>
        addEdge(
          {
            ...connection,
            animated: true,
            style: { stroke: '#f59e0b', strokeWidth: 2 },
          },
          currentEdges
        )
      ),
    [setEdges]
  );

  const addNode = (kind) => {
    const info = nodeInfo[kind];
    const id = `${kind}-${Date.now()}`;

    const newNode = {
      id,
      type: 'flowNode',
      position: {
        x: 100 + Math.round(Math.random() * 180),
        y: 100 + nodes.length * 70,
      },
      data: {
        kind,
        title: info.title,
        content: info.content,
        ...(kind === 'trigger' ? { keyword: '' } : {}),
      },
    };

    setNodes((currentNodes) => [...currentNodes, newNode]);
    setSelectedNodeId(id);
  };

  const updateSelectedNode = (field, value) => {
    if (!selectedNode) return;

    setNodes((currentNodes) =>
      currentNodes.map((node) =>
        node.id === selectedNode.id
          ? { ...node, data: { ...node.data, [field]: value } }
          : node
      )
    );
  };

  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100vh',
        background: '#0f172a',
        color: '#e2e8f0',
        overflow: 'hidden',
      }}
    >
      <aside
        style={{
          width: 270,
          minWidth: 230,
          padding: 16,
          background: '#020617',
          borderRight: '1px solid #334155',
          overflowY: 'auto',
          boxSizing: 'border-box',
        }}
      >
        <h2 style={{ fontSize: 19, margin: '0 0 6px' }}>
          ⚡ Flow Elements
        </h2>
        <p style={{ fontSize: 12, color: '#94a3b8', marginBottom: 20 }}>
          নোড যোগ করো, তারপর ক্যানভাসে টেনে সাজাও
        </p>

        {Object.entries(nodeInfo).map(([kind, info]) => (
          <button
            key={kind}
            onClick={() => addNode(kind)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              width: '100%',
              padding: 12,
              marginBottom: 9,
              borderRadius: 10,
              border: '1px solid #334155',
              background: '#0f172a',
              color: '#e2e8f0',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <span style={{ fontSize: 20 }}>{info.icon}</span>
            <span style={{ fontSize: 13, fontWeight: 600 }}>
              {info.title}
            </span>
          </button>
        ))}

        <div style={{ borderTop: '1px solid #334155', marginTop: 18, paddingTop: 16 }}>
          <h3 style={{ fontSize: 14, color: '#fbbf24' }}>
            ⚙️ নোড সেটিংস
          </h3>

          {selectedNode ? (
            <>
              <label style={{ display: 'block', fontSize: 12, marginTop: 12 }}>
                নোডের নাম
              </label>
              <input
                value={selectedNode.data.title || ''}
                onChange={(event) => updateSelectedNode('title', event.target.value)}
                style={fieldStyle}
              />

              {selectedNode.data.kind === 'trigger' && (
                <>
                  <label style={labelStyle}>Trigger Keyword</label>
                  <input
                    value={selectedNode.data.keyword || ''}
                    onChange={(event) =>
                      updateSelectedNode('keyword', event.target.value)
                    }
                    placeholder="দাম কত / Price"
                    style={fieldStyle}
                  />
                </>
              )}

              <label style={labelStyle}>কন্টেন্ট / সেটিংস</label>
              <textarea
                value={selectedNode.data.content || ''}
                onChange={(event) =>
                  updateSelectedNode('content', event.target.value)
                }
                rows={5}
                style={{ ...fieldStyle, resize: 'vertical' }}
              />

              <button
                onClick={() => {
                  setNodes((current) =>
                    current.filter((node) => node.id !== selectedNode.id)
                  );
                  setEdges((current) =>
                    current.filter(
                      (edge) =>
                        edge.source !== selectedNode.id &&
                        edge.target !== selectedNode.id
                    )
                  );
                  setSelectedNodeId('');
                }}
                style={{
                  ...fieldStyle,
                  background: '#7f1d1d',
                  borderColor: '#991b1b',
                  cursor: 'pointer',
                }}
              >
                🗑️ নির্বাচিত নোড মুছুন
              </button>
            </>
          ) : (
            <p style={{ color: '#94a3b8', fontSize: 12 }}>
              সেটিংস পরিবর্তন করতে একটি নোড নির্বাচন করো।
            </p>
          )}
        </div>
      </aside>

      <main style={{ flex: 1, minWidth: 0, height: '100%', background: '#111827' }}>
        <div
          style={{
            padding: '10px 16px',
            background: '#020617',
            borderBottom: '1px solid #334155',
            fontSize: 12,
            color: '#cbd5e1',
          }}
        >
          Flow Canvas — নোড সরাও এবং এক নোডের নিচের পয়েন্ট থেকে অন্য নোডে লাইন টানো
        </div>

        <div style={{ height: 'calc(100% - 39px)' }}>
          <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={(_, node) => setSelectedNodeId(node.id)}
          nodesDraggable={true}
          nodesConnectable={true}
          elementsSelectable={true}
          fitView
          deleteKeyCode={['Backspace', 'Delete']}
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#334155" gap={20} />
          <Controls />
          <MiniMap
            nodeColor={(node) =>
              (nodeInfo[node.data?.kind] || nodeInfo.message).color
            }
            style={{ background: '#020617' }}
          />
        </ReactFlow>
        </div>
      </main>
    </div>
  );
}

const fieldStyle = {
  boxSizing: 'border-box',
  width: '100%',
  marginTop: 6,
  marginBottom: 12,
  padding: 9,
  background: '#0f172a',
  color: '#e2e8f0',
  border: '1px solid #334155',
  borderRadius: 7,
  fontSize: 12,
};

const labelStyle = {
  display: 'block',
  fontSize: 12,
  marginTop: 8,
  color: '#94a3b8',
};
