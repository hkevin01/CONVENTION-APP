import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import {
    Dimensions,
    Modal,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { EventFilters } from '../api/events';
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

interface EventFilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApplyFilters: (filters: EventFilters) => void;
  initialFilters: EventFilters;
  categories: string[];
  locations: string[];
}

const sortOptions = [
  { label: 'Date (Earliest First)', value: 'date-asc' },
  { label: 'Date (Latest First)', value: 'date-desc' },
  { label: 'Title (A-Z)', value: 'title-asc' },
  { label: 'Title (Z-A)', value: 'title-desc' },
  { label: 'Location (A-Z)', value: 'location-asc' },
  { label: 'Category (A-Z)', value: 'category-asc' },
];

export default function EventFilterModal({
  visible,
  onClose,
  onApplyFilters,
  initialFilters,
  categories,
  locations,
}: EventFilterModalProps) {
  const [filters, setFilters] = useState<EventFilters>(initialFilters);
  const colorScheme = useColorScheme();
  const { width } = Dimensions.get('window');

  const handleApplyFilters = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleResetFilters = () => {
    const resetFilters: EventFilters = {
      search: '',
      category: '',
      location: '',
      sortBy: 'date',
      sortOrder: 'asc',
      page: 1,
      limit: 20,
    };
    setFilters(resetFilters);
  };

  const updateFilter = (key: keyof EventFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const getSortValue = () => {
    return `${filters.sortBy}-${filters.sortOrder}`;
  };

  const setSortValue = (value: string) => {
    const [sortBy, sortOrder] = value.split('-');
    setFilters(prev => ({ 
      ...prev, 
      sortBy: sortBy as 'date' | 'title' | 'location' | 'category', 
      sortOrder: sortOrder as 'asc' | 'desc',
      page: 1 
    }));
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <ThemedView style={styles.container}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: Colors[colorScheme].border }]}>
          <TouchableOpacity onPress={onClose} style={styles.headerButton}>
            <ThemedText style={styles.headerButtonText}>Cancel</ThemedText>
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>Filter Events</ThemedText>
          <TouchableOpacity onPress={handleApplyFilters} style={styles.headerButton}>
            <ThemedText style={[styles.headerButtonText, { color: Colors[colorScheme].tint }]}>
              Apply
            </ThemedText>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Search */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Search</ThemedText>
            <TextInput
              style={[
                styles.searchInput,
                {
                  backgroundColor: Colors[colorScheme].background,
                  borderColor: Colors[colorScheme].border,
                  color: Colors[colorScheme].text,
                },
              ]}
              placeholder="Search events..."
              placeholderTextColor={Colors[colorScheme].text + '80'}
              value={filters.search}
              onChangeText={(text) => updateFilter('search', text)}
              clearButtonMode="while-editing"
            />
          </View>

          {/* Category Filter */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Category</ThemedText>
            <View style={[styles.pickerContainer, { borderColor: Colors[colorScheme].border }]}>
              <Picker
                selectedValue={filters.category}
                onValueChange={(value: string) => updateFilter('category', value)}
                style={[styles.picker, { color: Colors[colorScheme].text }]}
                itemStyle={{ color: Colors[colorScheme].text }}
              >
                <Picker.Item label="All Categories" value="" />
                {categories.map((category) => (
                  <Picker.Item
                    key={category}
                    label={category.charAt(0).toUpperCase() + category.slice(1)}
                    value={category}
                  />
                ))}
              </Picker>
            </View>
          </View>

          {/* Location Filter */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Location</ThemedText>
            <View style={[styles.pickerContainer, { borderColor: Colors[colorScheme].border }]}>
              <Picker
                selectedValue={filters.location}
                onValueChange={(value: string) => updateFilter('location', value)}
                style={[styles.picker, { color: Colors[colorScheme].text }]}
                itemStyle={{ color: Colors[colorScheme].text }}
              >
                <Picker.Item label="All Locations" value="" />
                {locations.map((location) => (
                  <Picker.Item key={location} label={location} value={location} />
                ))}
              </Picker>
            </View>
          </View>

          {/* Sort Options */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Sort By</ThemedText>
            <View style={[styles.pickerContainer, { borderColor: Colors[colorScheme].border }]}>
              <Picker
                selectedValue={getSortValue()}
                onValueChange={setSortValue}
                style={[styles.picker, { color: Colors[colorScheme].text }]}
                itemStyle={{ color: Colors[colorScheme].text }}
              >
                {sortOptions.map((option) => (
                  <Picker.Item key={option.value} label={option.label} value={option.value} />
                ))}
              </Picker>
            </View>
          </View>

          {/* Quick Filter Tags */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Quick Filters</ThemedText>
            <View style={styles.tagContainer}>
              <TouchableOpacity
                style={[
                  styles.tag,
                  filters.category === 'conference' && { backgroundColor: Colors[colorScheme].tint },
                  { borderColor: Colors[colorScheme].border },
                ]}
                onPress={() => updateFilter('category', filters.category === 'conference' ? '' : 'conference')}
              >
                <ThemedText
                  style={[
                    styles.tagText,
                    filters.category === 'conference' && { color: '#FFFFFF' },
                  ]}
                >
                  Conferences
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.tag,
                  filters.category === 'workshop' && { backgroundColor: Colors[colorScheme].tint },
                  { borderColor: Colors[colorScheme].border },
                ]}
                onPress={() => updateFilter('category', filters.category === 'workshop' ? '' : 'workshop')}
              >
                <ThemedText
                  style={[
                    styles.tagText,
                    filters.category === 'workshop' && { color: '#FFFFFF' },
                  ]}
                >
                  Workshops
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.tag,
                  filters.category === 'networking' && { backgroundColor: Colors[colorScheme].tint },
                  { borderColor: Colors[colorScheme].border },
                ]}
                onPress={() => updateFilter('category', filters.category === 'networking' ? '' : 'networking')}
              >
                <ThemedText
                  style={[
                    styles.tagText,
                    filters.category === 'networking' && { color: '#FFFFFF' },
                  ]}
                >
                  Networking
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>

          {/* Reset Button */}
          <View style={styles.section}>
            <TouchableOpacity
              style={[styles.resetButton, { borderColor: Colors[colorScheme].border }]}
              onPress={handleResetFilters}
            >
              <ThemedText style={styles.resetButtonText}>Reset All Filters</ThemedText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ThemedView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
  },
  headerButton: {
    minWidth: 60,
  },
  headerButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tag: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  tagText: {
    fontSize: 14,
    fontWeight: '500',
  },
  resetButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
