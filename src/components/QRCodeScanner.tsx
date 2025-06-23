import { CameraView, useCameraPermissions } from 'expo-camera';
import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

interface QRCodeScannerProps {
  isVisible: boolean;
  onClose: () => void;
  onScanSuccess: (data: string) => void;
  title?: string;
  description?: string;
}

export default function QRCodeScanner({
  isVisible,
  onClose,
  onScanSuccess,
  title = "Scan QR Code",
  description = "Position the QR code within the frame to scan"
}: QRCodeScannerProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const colorScheme = useColorScheme();
  const { width, height } = Dimensions.get('window');

  useEffect(() => {
    if (isVisible && !permission?.granted) {
      requestPermission();
    }
    if (isVisible) {
      setScanned(false);
    }
  }, [isVisible, permission, requestPermission]);

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    if (scanned) return;
    
    setScanned(true);
    
    try {
      // Try to parse as JSON for ticket data
      const parsedData = JSON.parse(data);
      onScanSuccess(parsedData);
    } catch {
      // If not JSON, use as plain text
      onScanSuccess(data);
    }
  };

  const handleScanAgain = () => {
    setScanned(false);
  };

  if (!permission) {
    return (
      <Modal visible={isVisible} animationType="slide">
        <ThemedView style={styles.permissionContainer}>
          <ThemedText style={styles.permissionText}>
            Requesting camera permission...
          </ThemedText>
        </ThemedView>
      </Modal>
    );
  }

  if (!permission.granted) {
    return (
      <Modal visible={isVisible} animationType="slide">
        <ThemedView style={styles.permissionContainer}>
          <ThemedText style={styles.permissionTitle}>
            Camera Permission Required
          </ThemedText>
          <ThemedText style={styles.permissionText}>
            This app needs camera access to scan QR codes for ticket check-ins.
          </ThemedText>
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: Colors[colorScheme].tint }]}
            onPress={() => requestPermission()}
          >
            <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>Grant Permission</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: Colors[colorScheme].text, marginTop: 10 }]}
            onPress={onClose}
          >
            <Text style={[styles.buttonText, { color: Colors[colorScheme].background }]}>Close</Text>
          </TouchableOpacity>
        </ThemedView>
      </Modal>
    );
  }

  return (
    <Modal visible={isVisible} animationType="slide">
      <ThemedView style={styles.container}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: Colors[colorScheme].background }]}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <ThemedText style={styles.closeButtonText}>✕</ThemedText>
          </TouchableOpacity>
          <ThemedText style={styles.title}>{title}</ThemedText>
          <View style={styles.placeholder} />
        </View>

        {/* Scanner */}
        <View style={styles.scannerContainer}>
          <CameraView
            style={StyleSheet.absoluteFillObject}
            facing="back"
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: ["qr", "pdf417"],
            }}
          />
          
          {/* Scanning frame overlay */}
          <View style={styles.overlay}>
            <View style={styles.scanFrame}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
            </View>
          </View>
        </View>

        {/* Bottom content */}
        <View style={[styles.bottomContent, { backgroundColor: Colors[colorScheme].background }]}>
          <ThemedText style={styles.description}>{description}</ThemedText>
          
          {scanned && (
            <View style={styles.scannedContainer}>
              <ThemedText style={styles.scannedText}>✓ QR Code Scanned!</ThemedText>
              <TouchableOpacity 
                style={[styles.button, { backgroundColor: Colors[colorScheme].tint }]}
                onPress={handleScanAgain}
              >
                <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>Scan Again</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ThemedView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  closeButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  scannerContainer: {
    flex: 1,
    position: 'relative',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  scanFrame: {
    width: 250,
    height: 250,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#FFFFFF',
    borderWidth: 3,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  bottomContent: {
    padding: 20,
    minHeight: 120,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  scannedContainer: {
    alignItems: 'center',
  },
  scannedText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 16,
  },
  button: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
