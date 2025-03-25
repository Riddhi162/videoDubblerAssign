import React, { useState } from 'react';
import { 
  Container, 
  Text, 
  Button, 
  Group, 
  Paper,
  Textarea,
  Box
} from '@mantine/core';

const FOREGROUND_COLORS = [
  '#FF0000',
  '#00FF00',
  '#FFFF00',
  '#0000FF',
  '#FF00FF',
  '#00FFFF',
  '#FFFFFF'
];

const BACKGROUND_COLORS = [
  '#000000',
  '#FF0000',
  '#808080',
  '#C0C0C0',
  '#A52A2A',
  '#800080',
  '#FFF0F5'
];

function App() {
  const [text, setText] = useState('Welcome to Rebane\'s Discord Colored Text Generator!');
  const [selectedText, setSelectedText] = useState('');
  const [selectedRange, setSelectedRange] = useState({ start: 0, end: 0 });
  const [fgColor, setFgColor] = useState('#FFFFFF');
  const [bgColor, setBgColor] = useState('#000000');
  const [coloredSegments, setColoredSegments] = useState([]);
  const [previewColor, setPreviewColor] = useState(null);

  const handleTextSelection = (event) => {
    const start = event.currentTarget.selectionStart;
    const end = event.currentTarget.selectionEnd;
    const selected = text.substring(start, end);
    setSelectedText(selected);
    setSelectedRange({ start, end });
    setPreviewColor(null);
  };

  const applyColor = () => {
    if (!selectedText) return;

    const newSegment = {
      text: selectedText,
      start: selectedRange.start,
      end: selectedRange.end,
      fgColor,
      bgColor
    };

    const filteredSegments = coloredSegments.filter(
      segment => 
        segment.end <= selectedRange.start || 
        segment.start >= selectedRange.end
    );

    setColoredSegments([...filteredSegments, newSegment]);
    setPreviewColor(null);
  };

  const renderColoredText = () => {
    if (coloredSegments.length === 0) return text;

    const sortedSegments = [...coloredSegments].sort((a, b) => b.start - a.start);

    let coloredText = text;
    sortedSegments.forEach(segment => {
      const styledText = 
        `\u001b[${getFgCode(segment.fgColor)};${getBgCode(segment.bgColor)}m${segment.text}\u001b[0m`;
      coloredText = 
        coloredText.slice(0, segment.start) + 
        styledText + 
        coloredText.slice(segment.end);
    });

    return coloredText;
  };

  const handleForegroundColorSelect = (color) => {
    setFgColor(color);
    if (selectedText) {
      setPreviewColor({ 
        fgColor: color, 
        bgColor: bgColor 
      });
    }
  };

  const handleBackgroundColorSelect = (color) => {
    setBgColor(color);
    if (selectedText) {
      setPreviewColor({ 
        fgColor: fgColor, 
        bgColor: color 
      });
    }
  };

  const getFgCode = (color) => {
    const colorMap = {
      '#FF0000': '31',
      '#00FF00': '32',
      '#FFFF00': '33',
      '#0000FF': '34',
      '#FF00FF': '35',
      '#00FFFF': '36',
      '#FFFFFF': '37'
    };
    return colorMap[color] || '37';
  };

  const getBgCode = (color) => {
    const colorMap = {
      '#000000': '40',
      '#FF0000': '41',
      '#808080': '100',
      '#C0C0C0': '47',
      '#A52A2A': '41',
      '#800080': '45',
      '#FFF0F5': '47'
    };
    return colorMap[color] || '40';
  };

  const copyText = () => {
    navigator.clipboard.writeText(renderColoredText());
  };

  const resetAll = () => {
    setText('Welcome to Rebane\'s Discord Colored Text Generator!');
    setColoredSegments([]);
    setFgColor('#FFFFFF');
    setBgColor('#000000');
    setSelectedText('');
    setPreviewColor(null);
  };

  return (
    <Container size="xs" px="xs">
      <Text 
        size="xl" 
        weight={700} 
        align="center" 
        variant="gradient"
        gradient={{ from: 'blue', to: 'cyan', deg: 45 }}
        my="md"
      >
        Rebane's Discord Colored Text Generator
      </Text>

      <Paper withBorder shadow="md" p="md" mb="md">
        <Text size="sm" color="dimmed" mb="xs">
          This is a simple app that creates colored Discord messages using the 
          ANSI color codes available on the latest Discord desktop versions.
        </Text>
        <Text size="sm" color="dimmed">
          To use this, write your text, select parts of it and assign colors to them, 
          then copy it using the button below, and send in a Discord message.
        </Text>
      </Paper>

      {previewColor && selectedText ? (
        <Box 
          mb="md" 
          p="xs" 
          style={{ 
            backgroundColor: previewColor.bgColor, 
            color: previewColor.fgColor 
          }}
        >
          Preview: {selectedText}
        </Box>
      ) : null}

      <Textarea
        value={text}
        onChange={(event) => setText(event.currentTarget.value)}
        onSelect={handleTextSelection}
        minRows={4}
        mb="md"
      />

      <Group position="center" mb="md">
        <Text>Foreground Colors:</Text>
        {FOREGROUND_COLORS.map(color => (
          <Button
            key={color}
            variant={fgColor === color ? 'filled' : 'subtle'}
            color="dark"
            style={{ 
              backgroundColor: color, 
              border: fgColor === color ? '2px solid white' : 'none'
            }}
            onClick={() => handleForegroundColorSelect(color)}
          />
        ))}
      </Group>

      <Group position="center" mb="md">
        <Text>Background Colors:</Text>
        {BACKGROUND_COLORS.map(color => (
          <Button
            key={color}
            variant={bgColor === color ? 'filled' : 'subtle'}
            color="dark"
            style={{ 
              backgroundColor: color, 
              border: bgColor === color ? '2px solid white' : 'none'
            }}
            onClick={() => handleBackgroundColorSelect(color)}
          />
        ))}
      </Group>

      <Group position="center">
        <Button onClick={applyColor}>Apply Color to Selected Text</Button>
        <Button onClick={copyText}>Copy Discord Text</Button>
        <Button onClick={resetAll} variant="outline">Reset All</Button>
      </Group>

      <Paper withBorder shadow="md" p="md" mt="md">
        <Text color="dimmed" size="xs">
          Colored Text Output: {renderColoredText()}
        </Text>
      </Paper>
    </Container>
  );
}

export default App;