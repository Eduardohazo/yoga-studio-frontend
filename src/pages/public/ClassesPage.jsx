import React, { useEffect } from 'react';
import ClassList from '../../components/classes/ClassList';
import PageWrapper from '../../components/layout/PageWrapper';
import { CLASS_TYPES, CLASS_LEVELS } from '../../utils/constants';
import { useDispatch, useSelector } from "react-redux";
import {
  fetchClasses,
  setFilter,
  selectClasses,
  selectClassesLoading,
  selectClassesFilters,
} from "../../redux/slices/classesSlice";

const ClassesPage = () => {
  const dispatch = useDispatch();

  const classes = useSelector(selectClasses);
  const loading = useSelector(selectClassesLoading);
  const filters = useSelector(selectClassesFilters);

  useEffect(() => {
    dispatch(fetchClasses(filters));
  }, [dispatch, filters]);

  return (
    <PageWrapper>
      <div className="mb-8">
        <h1 className="font-serif text-4xl font-bold text-gray-800 mb-2">All Classes</h1>
        <p className="text-gray-500">Find the perfect practice for your level and goals.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-8">
        <select
          value={filters.type}
          onChange={(e) => dispatch(setFilter({ type: e.target.value }))}
          className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white"
        >
          <option value="">All types</option>
          {CLASS_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>

        <select
          value={filters.level}
          onChange={(e) => dispatch(setFilter({ level: e.target.value }))}
          className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white"
        >
          <option value="">All levels</option>
          {CLASS_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>

        {(filters.type || filters.level) && (
          <button
            onClick={() => dispatch(setFilter({ type: "", level: "" }))}
            className="px-4 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg"
          >
            Clear filters
          </button>
        )}
      </div>

      <ClassList classes={classes} loading={loading} />
    </PageWrapper>
  );
};

export default ClassesPage;