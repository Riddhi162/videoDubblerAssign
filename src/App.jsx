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
  '#FF0000',   // Red
  '#00FF00',   // Green
  '#FFFF00',   // Yellow
  '#0000FF',   // Blue
  '#FF00FF',   // Magenta
  '#00FFFF',   // Cyan
  '#FFFFFF'    // White
];

const BACKGROUND_COLORS = [
  '#000000',   // Black
  '#FF0000',   // Red
  '#808080',   // Gray
  '#C0C0C0',   // Silver
  '#A52A2A',   // Brown
  '#800080',   // Purple
  '#FFF0F5'    // Lavender
];

function App() {
  const [text, setText] = useState('Welcome to Rebane\'s Discord Colored Text Generator!');
  const [selectedText, setSelectedText] = useState('');
  const [selectedRange, setSelectedRange] = useState({ start: 0, end: 0 });
  const [fgColor, setFgColor] = useState('#FFFFFF');
  const [bgColor, setBgColor] = useState('#000000');
  const [coloredSegments, setColoredSegments] = useState([]);

  const handleTextSelection = (event) => {
    const start = event.currentTarget.selectionStart;
    const end = event.currentTarget.selectionEnd;
    const selected = text.substring(start, end);
    
    setSelectedText(selected);
    setSelectedRange({ start, end });
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

    // Remove any overlapping segments
    const filteredSegments = coloredSegments.filter(
      segment => 
        segment.end <= selectedRange.start || 
        segment.start >= selectedRange.end
    );

    setColoredSegments([...filteredSegments, newSegment]);
  };

  const renderTextWithColors = () => {
    if (coloredSegments.length === 0) {
      return text;
    }

    // Sort segments by their position in the text
    const sortedSegments = [...coloredSegments].sort((a, b) => a.start - b.start);
    
    let result = [];
    let lastPosition = 0;

    sortedSegments.forEach(segment => {
      // Add text before the segment
      if (segment.start > lastPosition) {
        result.push(text.substring(lastPosition, segment.start));
      }
      
      // Add the colored segment
      result.push(
        <span 
          key={`${segment.start}-${segment.end}`}
          style={{
            color: segment.fgColor,
            backgroundColor: segment.bgColor
          }}
        >
          {segment.text}
        </span>
      );
      
      lastPosition = segment.end;
    });

    // Add remaining text after last segment
    if (lastPosition < text.length) {
      result.push(text.substring(lastPosition));
    }

    return result;
  };

  const handleForegroundColorSelect = (color) => {
    setFgColor(color);
    applyColor();
  };

  const handleBackgroundColorSelect = (color) => {
    setBgColor(color);
    applyColor();
  };

  const getFgCode = (color) => {
    const colorMap = {
      '#FF0000': '31',   // Red
      '#00FF00': '32',   // Green
      '#FFFF00': '33',   // Yellow
      '#0000FF': '34',   // Blue
      '#FF00FF': '35',   // Magenta
      '#00FFFF': '36',   // Cyan
      '#FFFFFF': '37'    // White
    };
    return colorMap[color] || '37';
  };

  const getBgCode = (color) => {
    const colorMap = {
      '#000000': '40',   // Black
      '#FF0000': '41',   // Red
      '#808080': '100',  // Gray
      '#C0C0C0': '47',   // Silver
      '#A52A2A': '41',   // Brown
      '#800080': '45',   // Purple
      '#FFF0F5': '47'    // Lavender
    };
    return colorMap[color] || '40';
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

  const copyText = () => {
    navigator.clipboard.writeText(renderColoredText());
  };

  const resetAll = () => {
    setText('Welcome to Rebane\'s Discord Colored Text Generator!');
    setColoredSegments([]);
    setFgColor('#FFFFFF');
    setBgColor('#000000');
    setSelectedText('');
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
      <Text size="sm" color="dimmed">
          This is preview window.
        </Text>
      <Box
        mb="md"
        p="xs"
        style={{
          backgroundColor: '#808080', // Changed to grey
          border: '1px solid #ced4da',
          borderRadius: '4px',
          minHeight: '100px',
          whiteSpace: 'pre-wrap'
        }}
      >
        {renderTextWithColors()}
      </Box>
      <Text size="sm" color="dimmed">
          Select text from here
        </Text>
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